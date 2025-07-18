import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage("Create new resume")
  createNewResume(@Body() createUserCVDto: CreateUserCVDto, @User() user: IUser) {
    return this.resumesService.createResumeService(createUserCVDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list resume")
  getAllResume(@Query("current") currentPage: string, @Query("pageSize") limit: string,
    @Query() queryString: string) {
    return this.resumesService.getAllResume(+currentPage, +limit, queryString);
  }

  @Patch(':id')
  @ResponseMessage("Update resume")
  update(@Param('id') id: string, @Body("status") status: string,@User() user: IUser ) {
    return this.resumesService.updateResumeService(id, status, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.removeResumeService(id,user);
  }

  @Get(':id')
  @ResponseMessage("Get resume by id")
  getById(id: string){
    return this.resumesService.getByIdService(id);
  }

  @Post('by-user')
  @ResponseMessage("Get resume by CV")
  getUserByCV(@User() user: IUser){
    return this.resumesService.getCVService(user);
  }
}
