import { IsNotEmpty, IsString } from "class-validator";

export class busRegistrationDto{

    @IsNotEmpty()
    @IsString()
    public registration: string;

    @IsNotEmpty()
    @IsString()
    public state: string;

    @IsNotEmpty()
    @IsString()
    public brand: string;

    @IsNotEmpty()
    @IsString()
    public model: string;

    @IsNotEmpty()
    @IsString()
    public productionYear: string;

    @IsNotEmpty()
    @IsString()
    public seats: string;

    @IsNotEmpty()
    @IsString()
    public engine: string;

}