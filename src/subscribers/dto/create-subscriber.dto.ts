import { IsNotEmpty } from "class-validator";

export class CreateSubscriberDto {

    @IsNotEmpty({message: "Email không được để trống"})
    email: string;
    @IsNotEmpty({message: "Name không được để trống"})
    name: string;
    @IsNotEmpty({message: "Skills không được để trống"})
    skills: string[];
}
