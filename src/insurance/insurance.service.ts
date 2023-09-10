import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { insuranceDto } from './dto/registerInsurance.dto';
import { Request } from 'express';

@Injectable()
export class InsuranceService {
    constructor(private prisma: PrismaService){};

    async registerInsurance(dto: insuranceDto, req: Request){
        const { company, price, createdAt, expiresAt, bus_id} = dto;
        const insurance = await this.prisma.busInsurance.findFirst({})
    }
}
