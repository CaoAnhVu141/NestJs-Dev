import {
  Controller, Get, Post, Body, Patch,
  Param, Delete,
  Query
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Throttle } from '@nestjs/throttler';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.createCompanyService(createCompanyDto, user);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get()
  @Public()
  @ResponseMessage("Fetch List Company with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAllService(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findDataById(@Param('id') id: string) {
    return this.companiesService.findByIdService(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser
  ) {
    return this.companiesService.updateById(id, updateCompanyDto, user);
  }

  @Delete(':id')
  removeById(
    @Param('id') id: string,
    @User() user: IUser //req.user
  ) {
    return this.companiesService.removeById(id, user);
  }
}
