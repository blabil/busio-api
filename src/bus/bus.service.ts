import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { busRegistrationDto } from './dto/busRegistration.dto';
import { BusState, BusEngine } from '@prisma/client'

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
}
