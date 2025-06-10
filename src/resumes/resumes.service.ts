import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }

  async createResumeService(createResumeDto: CreateResumeDto, user: IUser) {
    await this.resumeModel.create({
      ...createResumeDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
  }

  async getAllResume(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population,projection } = aqp(qs);
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

  async updateResumeService(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    return await this.resumeModel.findById({
      _id: id,
    }).updateOne({
      ...updateResumeDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
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
    return this.resumeModel.softDelete({_id: id });
  }

  async getByIdService(id: string){
   return await this.resumeModel.findOne({
      id: id,
    });
  }

  async getCVService(user: IUser){
      return await this.resumeModel.find({
        userId: user._id,
      });
  }
}
