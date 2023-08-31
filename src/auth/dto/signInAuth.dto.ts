import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInAuthoDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;

    @IsNotEmpty({message: 'Hasło nie może być puste'})
    @IsString()
    public password: string;
}