import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BusstopService {
    constructor(private prisma: PrismaService) { };

    async registerBusStop(address: string) {
        const foundBusStop = await this.prisma.busStop.findUnique({ where: { address: address } });
        if (foundBusStop) {
            throw new BadRequestException('Przystanek jest już zarejestrowany w aplikacji.');
        }

        const busStop = await this.prisma.busStop.create({
            data: {
                address: address
            }
        })

        return ({ message: "Pomyślnie dodano przystanek." })
    }

    async returnAllBusStops() {
        const stops = await this.prisma.busStop.findMany()
        return stops;
    }

    async returnBusStop(id: string) {
        const foundBusStop = await this.prisma.busStop.findUnique({ where: { id: parseInt(id) } });

        return foundBusStop;
    }

    async returnStopBusLines(id: string) {
        
        const foundBusLines = await this.prisma.busLineStop.findMany({ where: { busStop_id: parseInt(id) }, include: {busLine: true} });
        let newBusLines = [];


        for (const busLine of foundBusLines) {
            const element = { id: busLine.busLine_id, number: busLine.busLine.number };
            newBusLines.push(element);

        }
        return ({ busLines: newBusLines });  

    }




    async returnBusStopConectionTime(busStopFrom: string, busStopTo: string) {
        
        const BusStopConnection = await this.prisma.busStopConnection.findFirst({ where: { busStopFrom_id: parseInt(busStopFrom), busStopTo_id: parseInt(busStopTo) }});
        if (BusStopConnection) return ({ isTime: true, time: BusStopConnection.time });
        const BusStopConnection2 = await this.prisma.busStopConnection.findFirst({ where: { busStopFrom_id: parseInt(busStopTo), busStopTo_id: parseInt(busStopFrom) }});
        if (BusStopConnection2) return ({ isTime: true, time: BusStopConnection2.time });

        return ({ isTime: false });
    }

    async updateBusStop(id: string, address: string) {

        const foundBusStop = await this.prisma.busStop.findUnique({ where: { id: parseInt(id) } });
        if (!foundBusStop) throw new BadRequestException("Nie znaleziono przystanku");

        await this.prisma.busStop.update(
            {
                where: { id: parseInt(id) },
                data: {
                    address: address,
                }
            })
        return ({ message: "Pomyślnie edytowano przystanek." });
    }

    async returnStopBusConnections(id: string) {
        
        const foundBusStopConenctions1 = await this.prisma.busStopConnection.findMany({ where: { busStopFrom_id: parseInt(id) } });
        const foundBusStopConenctions2 = await this.prisma.busStopConnection.findMany({ where: { busStopTo_id: parseInt(id) } });

        let newConnections = [];

        for (const connection of foundBusStopConenctions1) {
            const busStop = await this.prisma.busStop.findUnique({ where: { id: connection.busStopTo_id } })
            const element = { busStopToID: busStop.id, address: busStop.address, time: connection.time };
            newConnections.push(element)
        }

        for (const connection of foundBusStopConenctions2) {
            const busStop = await this.prisma.busStop.findUnique({ where: { id: connection.busStopFrom_id } })
            const element = { busStopToID: busStop.id ,address: busStop.address, time: connection.time };
            newConnections.push(element)
        }

        return newConnections;
    }

    async updateStopTimeConnection(busStopFromID: string, busStopToID: string,  time: string) {
        const foundBusStopConenction = await this.prisma.busStopConnection.findFirst({where:{ busStopFrom_id: parseInt(busStopFromID), busStopTo_id: parseInt(busStopToID)}});
        if(foundBusStopConenction) await this.prisma.busStopConnection.update({ where: { busStopFrom_id_busStopTo_id: {busStopFrom_id: parseInt(busStopFromID), busStopTo_id: parseInt(busStopToID)}}, data: { time: parseInt(time) } });
        else await this.prisma.busStopConnection.update({ where: { busStopFrom_id_busStopTo_id: {busStopFrom_id: parseInt(busStopToID), busStopTo_id: parseInt(busStopFromID)}}, data: { time: parseInt(time) } });
        return ({message: "Pomyślnie edytowano czas."});
    }
}
