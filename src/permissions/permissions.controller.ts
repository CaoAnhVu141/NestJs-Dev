import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { query } from 'express';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("Created permission success!")
  createPermission(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    console.log("check result: ",createPermissionDto);
    return this.permissionsService.createPermissionService(createPermissionDto,user);
  }

  @Get()
  @ResponseMessage("Fetch data permission success!")
  getAllPermission(@Query("current") currentPage: string, @Query("pageSize") limit: string, @Query() queryString: string) {
    return this.permissionsService.getAllDataService(+currentPage,+limit,queryString);
  }

  @Get(':id')
  @ResponseMessage("Get permission by id")
  findOne(@Param('id') id: string) {
    return this.permissionsService.findByIdService(id);
  }

  @Patch(':id')
  @ResponseMessage("Update data success!")
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto,@User() user: IUser) {
    return this.permissionsService.updateDataService(id, updatePermissionDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Delete data success")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.deleteByIdService(id,user);
  }
}
