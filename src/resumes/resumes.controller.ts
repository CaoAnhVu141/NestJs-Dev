import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage("Create new resume")
  createNewResume(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.createResumeService(createResumeDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list resume")
  getAllResume(@Query("current") currentPage: string, @Query("pageSize") limit: string,
    @Query() queryString: string) {
    return this.resumesService.getAllResume(+currentPage, +limit, queryString);
  }

  @Patch(':id')
  @ResponseMessage("Update resume")
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.updateResumeService(id, updateResumeDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.removeResumeService(id,user);
  }
}
