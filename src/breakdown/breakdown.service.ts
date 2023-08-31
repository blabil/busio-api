import { Injectable } from '@nestjs/common';
import { breakDownDto } from './dto/breakDown.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
import { breakDownModifyDto } from './dto/breakDownModify.dto';

@Injectable()
export class BreakdownService {

    constructor(private prisma: PrismaService){}

    async registerBreakDown(dto: breakDownDto, req: Request) {
        const {title, desc, bus_id } = dto;
        const user = req.user as {id:string};

        await this.prisma.busBreakDown.create({
            data: {
                title: title,
                desc: desc,
                bus: {connect: {id: parseInt(bus_id)}},
                user: {connect: {id: user.id}}
        }})


        return {message: "Dodano naprawę."};
    }

    async registerBreakDownModify(dto: breakDownModifyDto, req: Request)
    {   
        const {desc, breakDown_id} = dto;
        const user = req.user as {id:string}

        await this.prisma.busBreakDownModify.create({
            data:{
                desc: desc,
                BusBreakDown: {connect: {id: breakDown_id}},
                user: {connect: {id: user.id}}
            }
        })
        return {message: "Pomyślnie dodano modyfikacje"}
    }

    async getBusModifyList(id: string)
    {
        const response = await this.prisma.busBreakDownModify.findMany({where: {BusBreakDown_id: parseInt(id)}, include: { user: { select: { profile: {select: {fullName: true}}}}}});
        return response;
    }

    async getUserModifyList(id: string)
    {
        const response = await this.prisma.busBreakDownModify.findMany({where: {user_id: id}, include:{BusBreakDown: {select: {bus_id: true, title: true}}}});
        return ({data: response});
    }

    async markSolved(breakDown_id: string, req: Request)
    {
        const user = req.user as {id:string};
        await this.prisma.busBreakDownModify.create({
            data:{
                desc: "Oznaczono jako rozwiązane.",
                BusBreakDown: {connect: {id: parseInt(breakDown_id)}},
                user: { connect: { id: user.id}}
            }
        })

        await this.prisma.busBreakDown.update({
            where: {id: parseInt(breakDown_id)},
            data: {
                state: "SOLVED",
                solvedAt: new Date(),
            }
        })
        return {message: "Oznaczono jako rozwiązane."}
    }

    async getBusBreakDowns(id: string)
    {
        const breakdowns = await this.prisma.busBreakDown.findMany({
            where: { 
                bus_id: parseInt(id) },
            orderBy: {
                state: "desc",
            }
        })
        const bus = await this.prisma.bus.findUnique({where: {id: parseInt(id)}})
        return ({bus, breakdowns});
    }

    async getBreakDown(id: string)
    {
        const breakdown = await this.prisma.busBreakDown.findUnique({where: {id: parseInt(id)}, include: {bus: true}});
        const breakdownModifyList = await this.getBusModifyList(id);
        return ({data: breakdown, modifyList: breakdownModifyList }); 
    }

    async getUserBreakDowns(id: string)
    {
        const data = await this.prisma.busBreakDown.findMany({
            where: { 
                user_id: id },
            orderBy: {
                state: "desc",
            }
        })
        return ({data});
    }
}
