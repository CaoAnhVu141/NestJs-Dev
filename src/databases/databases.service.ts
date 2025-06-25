import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schema/permission.schema';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { UserDocument,User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,

        private configService: ConfigService,
        private userService: UsersService,
    ) { }

   async onModuleInit() {
        const isShouldInit = this.configService.get<string>("SHOULD_INIT");
        if(Boolean(isShouldInit)){
            const countUser = await this.userModel.count({});
            const countPermission = await this.permissionModel.count({});
            const countRole = await this.roleModel.count({});

            if(countPermission === 0){
                await this.permissionModel.insertMany(INIT_PERMISSIONS)
            }

            //create roles
            if(countRole === 0){
                const permission = await this.permissionModel.find({}).select("_id");
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Full chức năng với quyền Admin",
                        isActive: true,
                        permissions: permission,
                    },
                    {
                        name: USER_ROLE,
                        description: "Chức năng là user",
                        isActive: true,
                        permissions: [],
                    }
                ]);
            }

            //create users
            if(countUser === 0){
                const adminRole = await this.roleModel.findOne({name: ADMIN_ROLE});
                const userRole = await this.roleModel.findOne({name: USER_ROLE});

                await this.userModel.insertMany([
                    {
                        name: "Nguyễn Văn Bấc",
                        email: "nguyenvanbac@gmail.com",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        gender: "male",
                        address: "Trung Tiến, Hà Tĩnh",
                        role: adminRole?._id,
                    },
                    {
                        name: "Củ Thị Riềng",
                        email: "curieng@gmail.com",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        gender: "male",
                        address: "Trung Thịnh, Hà Tĩnh",
                        role: adminRole?._id,
                    },
                    {
                        name: "Nguyễn Văn A",
                        email: "vana@gmail.com",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        gender: "male",
                        address: "HCMC",
                        role: userRole?._id,
                    },
                ])
            }
        }
    }
}
