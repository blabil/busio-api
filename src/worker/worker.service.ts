import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DriverService {
    constructor(private prisma: PrismaService){}

    async getWorkers(){
        const users = await this.prisma.user.findMany({
            where: { 
            OR: [
                {role: "DRIVER"},
                {role: "MECHANIC"}
            ]}, include: {profile: true}
        })
        return users;
    }

    async getWorker(id: string)
    {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
             include: {profile:true, busBreakDown: true, busBreakDownModify: true, busIssue: true, busIssueModify: true, busReview: {orderBy: {isActuall: "desc"}}}})

        if(!user)
        {
            throw new NotFoundException();
        }
          
        
        delete user.passwordHash;
        return user;
    }
}
