import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from './schema/subscriber.schema';
import { IUser } from 'src/users/users.interface';

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

  findAll() {
    return `This action returns all subscribers`;
  }

  async findOneService(id: string) {
    return await this.subscriberModel.findById(id);
  }

  update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    return `This action updates a #${id} subscriber`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriber`;
  }
}
