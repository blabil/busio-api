import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TimeStampTools } from '../helpers';

@Injectable()
export class WorkerService {
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
             include: {profile:true, busBreakDown: true, busBreakDownModify: true, busIssue: true, busIssueModify: true, busReview: {orderBy: {isActuall: "desc"}}, BusLineRoute: {include:{busLine: true}}}})

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
            let routeFulltime : number = 0
            route.time === "FULL" ? routeFulltime = route.busLine.fullTime * 2 : routeFulltime = route.busLine.fullTime;
            const initialTime = TimeStampTools.returnFormatDate(route.startTime, routeFulltime);
            const fullTime = TimeStampTools.getTimeStampFromTimeString(initialTime);
            const startTime = TimeStampTools.getTimeStampFromTimeString(route.startTime);

            const driverList = await this.prisma.user.findMany({where: {role:"DRIVER"}, include:{ BusLineRoute: {select: {type: true, startTime: true, busLine: true}},profile: {select: {fullName: true}}}})
               outerLoop:  for(const driver of driverList)
               {
                    if(driver.BusLineRoute.length === 0 ) 
                    {
                        filteredDriverArray.push(driver);
                        continue outerLoop;
                    }

                    let checkIfDriverAviable : boolean = false;
                    for(const droute of driver.BusLineRoute)
                    {
                        if(route.type === "MONFRI")
                        {
                            if(droute.type === "MONFRI" || droute.type === "WEEK"){
                                const tempTime = TimeStampTools.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = TimeStampTools.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = TimeStampTools.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) checkIfDriverAviable = true;
                                else checkIfDriverAviable = false;
                            }
                            else if(droute.type === "WEEKEND") checkIfDriverAviable = true;
                        } else if(route.type === "WEEKEND") {
                            if(droute.type === "WEEKEND" || droute.type === "WEEK"){
                                const tempTime = TimeStampTools.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = TimeStampTools.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = TimeStampTools.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) checkIfDriverAviable = true;
                                else checkIfDriverAviable = false;
                            }
                            else if(droute.type === "MONFRI") checkIfDriverAviable = true;
                        }
                        else if(route.type === "WEEK")
                        {
                            if(droute.type === "MONFRI" || droute.type === "WEEK" || droute.type === "WEEKEND"){
                                const tempTime = TimeStampTools.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = TimeStampTools.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = TimeStampTools.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) checkIfDriverAviable = true;
                                else checkIfDriverAviable = false;
                            }
                        }
                        else checkIfDriverAviable = true;  
                    }
                    if(checkIfDriverAviable) filteredDriverArray.push(driver);
                }
        });
        return filteredDriverArray;
    }

    async assignDriverToRoute(id : string, driverID : string ){
        await this.prisma.busLineRoute.update({
            where: {id: parseInt(id)},
            data: {
                driver: {connect: {id: driverID}}
            }
        })
        const worker = await this.getWorker(driverID);
        delete worker.passwordHash;
        return ({message: "Pomyślnie przypisano kierowcę." , worker: worker});
    }
}
