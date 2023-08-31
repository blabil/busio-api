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

    async getDrivers(id: string)
    {
        const filteredDriverArray = [];
        await this.prisma.busLineRoute.findUnique({where:{id : parseInt(id)}, include: {busLine:{select: {fullTime: true}}}}).then(async (route) =>{
            const initialTime = this.returnFormatDate(route.startTime, route.busLine.fullTime);
            const fullTime = this.getTimeStampFromTimeString(initialTime);
            const startTime = this.getTimeStampFromTimeString(route.startTime);

            await this.prisma.user.findMany({where: {role:"DRIVER"}, include:{ BusLineRoute: {select: {type: true, startTime: true, busLine: true}},profile: {select: {fullName: true}}}}).then((driverList) =>{
                driverList.map((driver) =>{

                    if(route.type === "MONFRI"){
                        driver.BusLineRoute.map((droute) =>{
                            if(droute.type === "MONFRI" || droute.type === "WEEK"){
                                const tempTime = this.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = this.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = this.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) filteredDriverArray.push(driver);
                            }
                        })
                    }
                    if(route.type === "WEEKEND"){
                        driver.BusLineRoute.map((droute) =>{
                            if(droute.type === "WEEKEND" || droute.type === "WEEK"){
                                const tempTime = this.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = this.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = this.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) filteredDriverArray.push(driver);
                            }
                        })
                    }
                    if(route.type === "WEEK"){
                        driver.BusLineRoute.map((droute) =>{
                            if(droute.type === "MONFRI" || droute.type === "WEEK" || droute.type === "WEEKEND"){
                                const tempTime = this.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = this.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = this.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) filteredDriverArray.push(driver);
                            }
                        })
                    }
                    if(route.type==="SPECIAL") filteredDriverArray.push(driver)
                })
            })
        }
        );
        return filteredDriverArray;
    }

    returnFormatDate(startTime : string, fullTime : number)
    {
        const [godzina, minuty] : Array<string>= startTime.split(':')
        const date : Date = new Date();
        date.setHours(parseInt(godzina));
        date.setMinutes(parseInt(minuty));
        const timeMilis : number = fullTime * 60 * 1000; 
        date.setTime(date.getTime() + timeMilis);
        return date.toLocaleDateString("pl-PL", {
            hour: "numeric",
            minute: "numeric",
          }).split(', ')[1];
    }

    getTimeStampFromTimeString(timeString) {
        const [hours, minutes] = timeString.split(":").map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
      }
}
