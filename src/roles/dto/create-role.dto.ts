import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {

    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'IsActive không được để trống', })
    isActive: boolean;

    @IsNotEmpty({ message: 'Permisstions không được để trống', })
    @IsArray()
    @IsMongoId({each: true})
    permissions: mongoose.Types.ObjectId[]
}
