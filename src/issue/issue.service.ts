import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { issueDto } from './dto/issue.dto';
import { Request } from 'express';
import { issueModifyDto } from './dto/issueModify.dto';


@Injectable()
export class IssueService {
    constructor(private prisma: PrismaService){}

    async registerIssue(dto: issueDto, req: Request)
    {
        const {title, desc, bus_id } = dto;
        const user = req.user as {id:string};

        await this.prisma.busIssue.create({
            data: {
                title: title,
                desc: desc,
                bus: {connect: {id: parseInt(bus_id)}},
                user: {connect: {id: user.id}}
        }})


        return {message: "Dodano usterkę."};
    }

    async registerIssueModify(dto: issueModifyDto, req: Request)
    {
        const {desc, issue_id} = dto;
        const user = req.user as {id:string};

        await this.prisma.busIssueModify.create({
            data:{
                desc: desc,
                busIssue: {connect: {id: issue_id}},
                user: {connect: { id: user.id}},
            }
        })
        return {message: "Pomyślnie dodano modyfikacje"}
    }

    async getBusModifyList(id: string){
        const response = await this.prisma.busIssueModify.findMany({where: {busIssue_id: parseInt(id)}, include: { user: {select: {profile: {select: {fullName: true}}}}}});
        return response;
    }

    async getUserModifyList(id: string){
        const response = await this.prisma.busIssueModify.findMany({where: {user_id: id}, include: { busIssue: {select: {bus_id: true, title: true}}}});
        return ({data: response});
    }

    async markSolved(issue_id: string, req: Request)
    {
        const user = req.user as {id:string};

        await this.prisma.busIssueModify.create({
            data:{
                desc: "Oznaczono jako rozwiązane.",
                busIssue: {connect: {id: parseInt(issue_id)}},
                user: { connect: { id: user.id}}
            }
        })
        
        await this.prisma.busIssue.update({
            where: {id: parseInt(issue_id)}, 
            data:{
                state: "SOLVED",
                solvedAt: new Date(),
            }})
        return {message: "Oznaczono jako rozwiązane."}
    }

    async getBusIssues(id: string)
    {
        const issues = await this.prisma.busIssue.findMany({
            where: { 
                bus_id: parseInt(id) },
            orderBy: {
                state: "desc",
            }
            });
        const bus = await this.prisma.bus.findUnique({where: {id: parseInt(id)}})
        return ({bus, issues});
    }

    async getUserIssues(id: string)
    {
        const data = await this.prisma.busIssue.findMany({
            where: { 
                user_id: id },
            orderBy: {
                state: "desc",
            }
            });
        return ({data});
    }

    async getIssue(id: string)
    {
        const issue = await this.prisma.busIssue.findUnique({where: {id: parseInt(id)}, include: {bus: true}});
        const issueModifyList = await this.getBusModifyList(id);
        return ({data: issue, modifyList: issueModifyList }); 
    }
}
    /* if(user.id !== decodedUser.id)
        {
            throw new ForbiddenException();
        } */

        