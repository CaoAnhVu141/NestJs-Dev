import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {

    @IsNotEmpty({ message: 'Name không được để trống'})
    @IsString({message: 'Name là chuỗi string'})
    name: string;

    @IsNotEmpty({ message: 'apiPath không được để trống'})
    @IsString({message: 'ApiPath là chuỗi string'})
    apiPath: string;

    @IsNotEmpty({ message: 'Method không được để trống', })
    @IsString({message: 'Method là chuỗi string'})
    method: string;

    @IsNotEmpty({ message: 'Module không được để trống', })
    @IsString({message: 'Module là chuỗi string'})
    module: string;
}
