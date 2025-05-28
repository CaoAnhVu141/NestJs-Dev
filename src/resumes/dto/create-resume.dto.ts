import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {

    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @IsNotEmpty({ message: 'Url không được để trống', })
    url: string;

    @IsNotEmpty({ message: 'History không được để trống', })
    history: string;
}
