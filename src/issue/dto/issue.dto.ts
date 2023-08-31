import { IsNotEmpty, IsString } from "class-validator";

export class issueDto {

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