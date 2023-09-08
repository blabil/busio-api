import { BadRequestException, Injectable } from '@nestjs/common';
import { parse, isBefore, subMinutes } from 'date-fns';
import { PrismaService } from 'prisma/prisma.service';
import { busLineRouteDto } from './dto/busLineRoute.dto';
import { BusLineRouteTime, BusLineRouteType } from '@prisma/client';

@Injectable()
export class RouteService {
    constructor(private prisma: PrismaService) { };

    async createRoute(dto: busLineRouteDto) {
        const { busLineID, startTime, time, type} = dto

        const baseRouteTime = parse(startTime, 'HH:mm', new Date());
        console.log(baseRouteTime);

        const foundRoutes = await this.prisma.busLineRoute.findMany({ where: { busLine_id: parseInt(busLineID) }});
        let isEarlier = false;

        foundRoutes.map(async (route) => {
            const foundRouteTime = parse(route.startTime, 'HH:mm', new Date());

            const baseTimeMinus30 = subMinutes(baseRouteTime, 30);
            // ZAIMPLEMENTOWAĆ PRZYNAJMNIEJ 10 MINUT ODSTĘPU POMIĘDZY TRASAMI
            isEarlier = isBefore(foundRouteTime, baseTimeMinus30);

        })
      /*   if(isEarlier)
        {
            throw new BadRequestException('Jest już zdefiniowana trasa w podobnym czasie.');
        }  */
        const route = await this.prisma.busLineRoute.create({
            data: {
                busLine: {connect: {id: parseInt(busLineID)}},
                startTime: startTime,
                time: BusLineRouteTime[time as keyof BusLineRouteTime],
                type: BusLineRouteType[type as keyof BusLineRouteType]
            }
        })

        if (route) return ({ message: "Pomyślnie dodano trase!" });
        else ({ message: "Wystąpił błąd!" });
    }

    async getAllRoutes(busLineID: string) {
        const routes = await this.prisma.busLineRoute.findMany({ where: { busLine_id: parseInt(busLineID)}})

        if (routes) return ({ BusLineRoutes: routes });
    }

    async updateRoute(stringid: string, uuid: string) {

        const routeID = parseInt(stringid);
        const route = await this.prisma.route.update({
            where: { id: routeID },
            data: {
                driver_id: uuid,
        }})
        return ({message: "Pomyślnie przypisano kierowce."})
    }

    async deleteRoute(idstring: string)
    {
        const id = parseInt(idstring);


        const foundRoute = await this.prisma.busLineRoute.findUnique({where: {id:id}});

        if(!foundRoute)  throw new BadRequestException('Taka trasa nie istnieje w bazie.');

        const route = await this.prisma.busLineRoute.delete({where: {id:id}});

        return ({message: "Pomyślnie usunięto trase."});
    }

    async returnOneRoute(id: string)
    {
        
        const foundRoute = await this.prisma.busLineRoute.findUnique({where: {id: parseInt(id)}, include: {busLine: true, bus:{include: {busProfile: true}}, driver: {include: {profile: true}}}});
        if(foundRoute.driver)
            delete foundRoute.driver.passwordHash;
        return ({busLineID: foundRoute.busLine_id, busLineNumber: foundRoute.busLine.number, startTime: foundRoute.startTime, routetime: foundRoute.time, routeType: foundRoute.type, bus:foundRoute.bus, driver: foundRoute.driver });
    
    }

    async returnRoute(id: string)
    {
        const foundRoute = await this.prisma.busLineRoute.findUnique({where: {id: parseInt(id)}});
        const foundBusLineConnection = await this.prisma.busLineConnection.findMany({where: {busLine_id: foundRoute.busLine_id}});
        const sortedConnections = foundBusLineConnection.sort((a, b) => a.order - b.order);
         

        let route = [];
        let index = 0;
        let startTime = foundRoute.startTime;
        for(const element of sortedConnections)
        {
            if(index===0)
            {
                const connection = await this.prisma.busStopConnection.findFirst({
                    where: {
                        OR: [
                            {
                                busStopFrom_id: element.StopConnection_From,
                                busStopTo_id: element.StopConnection_To
                            },
                            {
                                busStopFrom_id: element.StopConnection_To,
                                busStopTo_id: element.StopConnection_From
                            }
                        ]
                }});
                let busStopTo = null;
                let busStopFrom = null;
                if(element.reverse === true)
                {
                    busStopFrom = await this.prisma.busStop.findUnique({where: {id: connection.busStopTo_id}});
                    busStopTo = await this.prisma.busStop.findUnique({where: {id: connection.busStopFrom_id}});
                }
                else{
                    busStopFrom = await this.prisma.busStop.findUnique({where: {id: connection.busStopFrom_id}});
                    busStopTo = await this.prisma.busStop.findUnique({where: {id: connection.busStopTo_id}});
                }
                


                let obj = {busStop: busStopFrom.address, time: startTime};
                route.push(obj);

                let godzina = new Date("1970-01-01T" + startTime + ":00")
                godzina.setMinutes(godzina.getMinutes() + connection.time)
                startTime = godzina.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                obj = {busStop: busStopTo.address, time: startTime}
                route.push(obj);
                index++;
            }
            else{
                const connection = await this.prisma.busStopConnection.findFirst({
                    where: {
                        OR: [
                            {
                                busStopFrom_id: element.StopConnection_From,
                                busStopTo_id: element.StopConnection_To
                            },
                            {
                                busStopFrom_id: element.StopConnection_To,
                                busStopTo_id: element.StopConnection_From
                            }
                        ]
                }});
                let busStopTo = null;
                if(element.reverse === true ) busStopTo = await this.prisma.busStop.findUnique({where: {id: connection.busStopFrom_id}});
                else busStopTo = await this.prisma.busStop.findUnique({where: {id: connection.busStopTo_id}});
                let godzina = new Date("1970-01-01T" + startTime + ":00")
                godzina.setMinutes(godzina.getMinutes() + connection.time)
                startTime = godzina.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                let obj = {busStop: busStopTo.address, time: startTime};
                route.push(obj);
            }

        }

        if(foundRoute.time === "FULL")
        {
            foundBusLineConnection.reverse();
            for(const element of foundBusLineConnection){
                const connection = await this.prisma.busStopConnection.findFirst({
                    where: {
                        OR: [
                            {
                                busStopFrom_id: element.StopConnection_From,
                                busStopTo_id: element.StopConnection_To
                            },
                            {
                                busStopFrom_id: element.StopConnection_To,
                                busStopTo_id: element.StopConnection_From
                            }
                        ]
                }}); 
                let busStopFrom = null;
                if(element.reverse===true) busStopFrom = await this.prisma.busStop.findUnique({where: {id: connection.busStopTo_id}});
                else busStopFrom = await this.prisma.busStop.findUnique({where: {id: connection.busStopFrom_id}});

                let godzina = new Date("1970-01-01T" + startTime + ":00")
                godzina.setMinutes(godzina.getMinutes() + connection.time)
                startTime = godzina.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                let obj = {busStop: busStopFrom.address, time: startTime};
                route.push(obj);
            }
        }
        return route;
    }

    async returnRouteDriver(id: string){
        const foundRoute = await this.prisma.route.findMany({where: {driver_id: id}});
        return foundRoute;
    }

    async returnRoutesAssignedTo(id: string, type: string)
    {
        let foundRoutes = null;
        if(type === 'bus') foundRoutes = await this.prisma.busLineRoute.findMany({where: {bus_id: parseInt(id)}, include: {busLine: {select: {number: true}}}});
        else foundRoutes = await this.prisma.busLineRoute.findMany({where: {driver_id: id}, include:{busLine: {select: {number: true}}}})
        return foundRoutes;
    }
}
