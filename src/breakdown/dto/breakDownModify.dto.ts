import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class breakDownModifyDto {

    @IsNotEmpty()
    @IsString()
    public desc: string

    @IsNotEmpty()
    @IsNumber()
    public breakDown_id: number

}