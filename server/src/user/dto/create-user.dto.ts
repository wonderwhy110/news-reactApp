import { IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email:string;

    @MinLength(5, {message: 'Длина пароля  должна быть больше 5 символов'})
    password: string;
    id:number;
}
