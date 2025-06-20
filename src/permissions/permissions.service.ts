import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { PermissionsModule } from './permissions.module';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { throwError } from 'rxjs';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {

  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }

  async createPermissionService(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const checkexist = await this.permissionModel.findOne({ apiPath, method });
    if (checkexist) {
      throw new BadRequestException("ApiPath, method đã tồn tại");
    }
    const dataPermission = await this.permissionModel.create({
      name, apiPath, method, module,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return dataPermission;
  }

  async getAllDataService(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả render
    }
  }

  async findByIdService(id: string) {
    const item = await this.permissionModel.findById(id);
    if (!item || item.isDeleted) {
      throw new NotFoundException("Permission không tồn tại hoặc đã bị xóa");
    }
    return await this.permissionModel.findById({
      _id: id
    });
  }

  async updateDataService(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const item = await this.permissionModel.findById(id);
    if (!item || item.isDeleted) {
      throw new NotFoundException("Permission không tồn tại hoặc đã bị xóa");
    }

    await this.permissionModel.updateOne({
      _id: id,
    }, {
      ...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    });
  }

  async deleteByIdService(id: string, user: IUser) {
    const item = await this.permissionModel.findById(id);
    if (!item || item.isDeleted) {
      throw new NotFoundException("Permission không tồn tại hoặc đã bị xóa");
    }
    await this.permissionModel.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return await this.permissionModel.softDelete({
      _id: id
    });
  }
}
