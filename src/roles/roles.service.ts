import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { create } from 'domain';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { use } from 'passport';
import aqp from 'api-query-params';
import { UsersModule } from 'src/users/users.module';

@Injectable()
export class RolesService {

  constructor(
    @InjectModel(Role.name)
    private rolesModel: SoftDeleteModel<RoleDocument>
  ) { }

  async createRoleService(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    const checkName = await this.rolesModel.findOne({ name: name.trim() });
    if (checkName) {
      throw new BadRequestException("Name đã tồn tại, vui lòng thay đổi lại name");
    }

    return await this.rolesModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async getAllDataService(currentPage: number, limit: number, qs: string) {

    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.rolesModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.rolesModel.find(filter)
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

  async getDataByIdService(id: string) {
    const item = await this.rolesModel.findById(id);
    if (!item || item.isDeleted) {
      throw new NotFoundException("Role không tồn tại hoặc đã bị xóa");
    }
    return await this.rolesModel.findById({ _id: id });
  }

  async updateDataSercice(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const checkRole = await this.rolesModel.findById(id);
    if (!checkRole || checkRole.isDeleted) {
      throw new NotFoundException("Role không tồn tại hoặc đã bị xóa");
    }

    return await this.rolesModel.updateOne({
      _id: id,
    }, {
      ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async deleteByIdService(id: string, user: IUser) {
    const checkRole = await this.rolesModel.findById(id);
    if (!checkRole || checkRole.isDeleted) {
      throw new NotFoundException("Role không tồn tại hoặc đã bị xóa");
    }

    await this.rolesModel.updateOne({
      _id: id,
    }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return this.rolesModel.softDelete({ _id: id });
  }
}
