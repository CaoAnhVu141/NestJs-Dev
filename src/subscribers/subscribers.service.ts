import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from './schema/subscriber.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {

    constructor(
      @InjectModel(Subscriber.name)
      private subscriberModel: SoftDeleteModel<SubscriberDocument>
    ) { }

  async createSubService(createSubscriberDto: CreateSubscriberDto, user: IUser) {
      return await this.subscriberModel.create({
        ...createSubscriberDto,
        createdBy: {
            _id: user._id,
            email: user.email
        }
      });
  }

  async getAllService(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.subscriberModel.find(filter)
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
      result
    }
  }

  async findOneService(id: string) {
    return await this.subscriberModel.findById(id);
  }

  async updateService(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
      const dataSub = await this.subscriberModel.findById(id);
      if(!dataSub || dataSub.isDeleted){
      throw new NotFoundException("Sub không tồn tại hoặc đã bị xóa");
    }

   return await this.subscriberModel.updateOne({
      _id: id,
    },{
      ...updateSubscriberDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async removeByIdService(id: string, user: IUser) {
    const dataSub = await this.subscriberModel.findById(id);
    if(!dataSub || dataSub.isDeleted){
      throw new NotFoundException("Sub không tồn tại hoặc đã bị xóa");
    }

    await this.subscriberModel.updateOne({
      _id: id
    },{
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.subscriberModel.softDelete({_id: id});
  }
}
