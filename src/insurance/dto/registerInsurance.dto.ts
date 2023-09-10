import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class insuranceDto {

    @IsString()
    @IsNotEmpty()
    public company: string

    @IsString()
    @IsNotEmpty()
    public price: string

    @IsString()
    @IsNotEmpty()
    public createdAt: Date

    @IsOptional()
    @IsString()
    public expiresAt: Date

    @IsString()
    @IsNotEmpty()
    public bus_id: string

}