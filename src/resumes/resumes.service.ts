import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }


  async createResumeService(createUserCVDto: CreateUserCVDto, user: IUser) {
    const { url, companyId, jobId } = createUserCVDto;
    const { email, _id } = user;

    const newCV = await this.resumeModel.create({
      url, companyId, email, jobId,
      userId: _id,
      status: "PENDING",
      createdBy: { _id, email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ]
    })

    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt,
    }
  }

  async getAllResume(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result // kết quả render
    }
  }

  async updateResumeService(id: string, status: string, user: IUser) {
    const updated = await this.resumeModel.updateOne(
      { _id: id }, {
      status,
      updateBy: {
        id: user._id,
        email: user.email
      },
      $push: {
        history: {
          status: status,
          updatedAt: new Date,
          updateBy: {
            _id: user._id,
            email: user.email,
          }
        }
      }
    });
    return updated;
  }

  async removeResumeService(id: string, user: IUser) {
    await this.resumeModel.findById({
      _id: id,
    }).updateOne({
      deletedBy: {
        id: user._id,
        email: user.email
      }
    });
    return this.resumeModel.softDelete({ _id: id });
  }

  async getByIdService(id: string) {
    return await this.resumeModel.findOne({
      id: id,
    });
  }

  async getCVService(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id,
    })
    .sort("-createdAt")
    .populate([
      {
        path: "companyId",
        select: {name: 1}
      },
      {
        path: "jobId",
        select: {name:1}
      }
    ]);
  }
}
