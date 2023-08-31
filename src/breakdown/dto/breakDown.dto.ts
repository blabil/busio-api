import { IsNotEmpty, IsString } from "class-validator";

export class breakDownDto {

    @IsNotEmpty()
    @IsString()
    public title: string

    @IsNotEmpty()
    @IsString()
    public desc: string

    @IsNotEmpty()
    @IsString()
    public bus_id: string

}