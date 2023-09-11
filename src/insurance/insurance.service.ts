import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { insuranceDto } from './dto/registerInsurance.dto';
import { Request } from 'express';

@Injectable()
export class InsuranceService {
    constructor(private prisma: PrismaService){};

    async registerInsurance(dto: insuranceDto, req: Request){
        const { company, price, createdAt, expiresAt, bus_id} = dto;
        const user = req.user as {id:string};

        await this.prisma.busInsurance.create({data:{
            company: company,
            price: parseInt(price),
            createdAt: new Date(createdAt),
            expiresAt: new Date(expiresAt),
            bus: {connect: {id: parseInt(bus_id)}},
            user: {connect: {id: user.id}}
        }})

        return ({message: "Dodano ubezpiecznie."});
    }

    async getBusInsurance(id: string){
        const insurances = await this.prisma.busInsurance.findMany({
            where: {
              bus_id: parseInt(id) },
            orderBy: {
              expiresAt: 'desc',
            }
          });
          const bus = await this.prisma.bus.findUnique({where: {id: parseInt(id)}});
          return ({bus, insurances});
    }
}
