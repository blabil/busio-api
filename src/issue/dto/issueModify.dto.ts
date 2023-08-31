import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class issueModifyDto {

    @IsNotEmpty()
    @IsString()
    public desc: string

    @IsNotEmpty()
    @IsNumber()
    public issue_id: number

}