import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { busRegistrationDto } from './dto/busRegistration.dto';
import { BusState, BusEngine } from '@prisma/client'
import { TimeStampTools } from 'src/helpers';

@Injectable()
export class BusService {
    constructor(private prisma: PrismaService){}


    async registerBus(dto : busRegistrationDto){

        const {registration, state, brand, model, productionYear, seats, engine } = dto;
        console.log(state);
        const bus = await this.prisma.bus.findUnique({where: {registration: registration}});

        if(bus)
        {
            throw new BadRequestException('Bus o podanym numerze rejestracyjnym istnieje już w bazie danych.');
        }
        const numberSeats = parseInt(seats);

        await this.prisma.bus.create({
            data: {
                registration: registration,
                state: BusState[state as keyof BusState],
                busProfile : {
                    create: {
                    brand: brand,
                    model: model,
                    productionYear: productionYear,
                    seats: numberSeats,
                    engine: BusEngine[engine as keyof BusEngine]
                    } 
                }
            }
        })

        return {message: 'Pomyślnie dodano pojazd do bazy danych.'};
    }

    async getBuses()
    {
        const buses = await this.prisma.bus.findMany({include: {busProfile: true}});
        return buses;
    }

    async getBus(busID: string)
    {
        const bus = await this.prisma.bus.findUnique({where: {id: parseInt(busID)}, 
        include: {
            busProfile: true,
            busIssues: {
                orderBy: { 
                state: "desc",
                }}, 
            busBreakDowns: {
                orderBy:{
                state: "desc",
                }}, 
            busReview: {
                orderBy:{
                    expiresAt: "desc",
                }}}});
        return bus;
    }

    async getAvialbleBuses(id: string)
    {
        const filteredBusArray = [];
        await this.prisma.busLineRoute.findUnique({where:{id : parseInt(id)}, include: {busLine:{select: {fullTime: true}}}}).then(async (route) =>{
            const initialTime = TimeStampTools.returnFormatDate(route.startTime, route.busLine.fullTime);
            const fullTime = TimeStampTools.getTimeStampFromTimeString(initialTime);
            const startTime = TimeStampTools.getTimeStampFromTimeString(route.startTime);

            await this.prisma.bus.findMany({include: {busLineRoute: {select: {type: true, startTime: true, busLine: true}}}}).then((busList) =>{
                busList.map((bus) =>{

                    if(route.type === "MONFRI"){
                        bus.busLineRoute.map((droute) =>{
                            if(droute.type === "MONFRI" || droute.type === "WEEK"){
                                const tempTime = TimeStampTools.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = TimeStampTools.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = TimeStampTools.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) filteredBusArray.push(bus);
                            }
                        })
                    }
                    if(route.type === "WEEKEND"){
                        bus.busLineRoute.map((droute) =>{
                            if(droute.type === "WEEKEND" || droute.type === "WEEK"){
                                const tempTime = TimeStampTools.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = TimeStampTools.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = TimeStampTools.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) filteredBusArray.push(bus);
                            }
                        })
                    }
                    if(route.type === "WEEK"){
                        bus.busLineRoute.map((droute) =>{
                            if(droute.type === "MONFRI" || droute.type === "WEEK" || droute.type === "WEEKEND"){
                                const tempTime = TimeStampTools.returnFormatDate(droute.startTime, droute.busLine.fullTime);
                                const tempFullTime = TimeStampTools.getTimeStampFromTimeString(tempTime);
                                const tempStartTime = TimeStampTools.getTimeStampFromTimeString(droute.startTime);
                                if(startTime> tempFullTime && fullTime < tempStartTime) filteredBusArray.push(bus);
                            }
                        })
                    }
                    if(route.type==="SPECIAL") filteredBusArray.push(bus)
                })
            })
        }
        );
        return filteredBusArray;
    }

    async assignBusToRoute(id : string, busID : string)
    {
        await this.prisma.busLineRoute.update({
            where: {id: parseInt(id)},
            data: {
                bus: {connect: {id: parseInt(busID)}}
            }
        })
        const bus = await this.prisma.bus.findUnique(
            {where: {
                id: parseInt(busID)}, 
            include: {
                busProfile: true}});
        return ({message: "Pomyślnie przypisano busa.", bus: bus});
        
    }
}
