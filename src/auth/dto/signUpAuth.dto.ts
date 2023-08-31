import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SignUpAuthoDto {
    @IsNotEmpty({message: 'Email nie może być pusty.'})
    @IsString()
    @IsEmail({}, {message: "Email musi być mailem."})
    public email: string;

    @IsNotEmpty({message: 'Imie i nazwisko nie mogą być puste.'})
    @IsString()
    public fullName: string;

    @IsNotEmpty({message: 'Telefon nie może byc pusty.'})
    @IsString()
    @Length(8, 20, {message: 'Numer musi skladać sie z 9 cyfr.'})
    public phone: string;

    @IsNotEmpty({message: 'Hasło nie może być puste.'})
    @IsString()
    @Length(8, 20, {message: 'Hasło musi składać sie od 8 do 20 znaków.'})
    public password: string;

    @IsNotEmpty({message: 'Musisz wybrać role.'})
    @IsString()
    public role: string;

    @IsString()
    public address: string;
}