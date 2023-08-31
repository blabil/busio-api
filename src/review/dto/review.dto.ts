import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class reviewDto {

    @IsOptional()
    @IsString()
    public additionalInfo?: string

    @IsNotEmpty()
    @IsBoolean()
    public isPositive: boolean

    @IsString()
    public createdAt: Date

    @IsOptional()
    @IsString()
    public expiresAt?: Date

    @IsString()
    @IsNotEmpty()
    public bus_id: string

}