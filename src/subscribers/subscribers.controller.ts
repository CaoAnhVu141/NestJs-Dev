import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage("Create sub success")
  createSubController(@Body() createSubscriberDto: CreateSubscriberDto,@User() user: IUser) {
    return this.subscribersService.createSubService(createSubscriberDto,user);
  }

  @Get()
  @ResponseMessage("Get all data success")
  getAllSubsController(@Query("current") currentPage: string, @Query("pageSize") limit: string, @Query() queryString: string) {
    return this.subscribersService.getAllService(+currentPage, +limit, queryString);
  }

  @Get(':id')
  @ResponseMessage("Get By Id success")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOneService(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage("Update success")
  updateSubController(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.updateService(updateSubscriberDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Deleted success")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.removeByIdService(id,user);
  }

  @Post("skills") 
  @ResponseMessage("Get user skills success")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser){
    return this.subscribersService.getSkills(user);
  }
}
