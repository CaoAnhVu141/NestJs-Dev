import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("Created data roles success!")
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.createRoleService(createRoleDto,user);
  }

  @Get()
  @ResponseMessage("Fetch data roles success!")
  getAllData(@Query("current") currentPage: string, @Query("pageSize") limit: string, @Query() queryString: string) {
    return this.rolesService.getAllDataService(+currentPage,+limit,queryString);
  }

  @Get(':id')
  @ResponseMessage("Get data by id!")
  findById(@Param('id') id: string) {
    return this.rolesService.getDataByIdService(id);
  }

  @Patch(':id')
  @ResponseMessage("Update data success!")
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.updateDataSercice(id, updateRoleDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Delete by id success")
  removeById(@Param('id') id: string,@User() user: IUser) {
    return this.rolesService.deleteByIdService(id,user);
  }
}
