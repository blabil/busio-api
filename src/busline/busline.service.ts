import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { busLineRegistrationDto } from './dto/busLineRegistration.dto';


@Injectable()
export class BuslineService {
    constructor(private prisma: PrismaService) { }


    async registerBusLine(dto: busLineRegistrationDto) {
        const { number, pola, czas, part } = dto
        const connections = czas;
        const stops = pola;

        if(number==="") throw new BadRequestException(`Nie podano numeru linii!`);
        if(part==="") throw new BadRequestException(`Nie podano odcinka!`);
        stops.map((stop) => {
            if(stop.id === "") throw new BadRequestException(`Nie wybrano przystanku!`);
        })
        connections.map((connection) => {
            if (connection.id === "") throw new BadRequestException(`Nie podano czasu pomiędzy przystankami!`);
        })

        const foundLine = await this.prisma.busLine.findUnique({ where: { number: number } });
        if (foundLine) throw new BadRequestException('Linia jest już zarejestrowana w aplikacji.');

        let fulltime = 0;
        connections.map((connection) => {
            fulltime = fulltime + parseInt(connection.time);
        })

        const busLine = await this.prisma.busLine.create({
            data: {
                number: number,
                fullTime: fulltime,
                part: part
            }
        })

        stops.map( async (stop) =>{
            const BusLineStop = await this.prisma.busLineStop.findMany({where: 
            {
                busLine_id: busLine.id,
                busStop_id: parseInt(stop)
            }})
            if(BusLineStop.length===0){
                await this.prisma.BusLineStop.create({data: {
                    busLine: {connect: {id: busLine.id}},
                    busStop: {connect: {id: parseInt(stop)}},
                }})
            }
        });
        
        connections.map(async (connection) => {
            const busStopFrom = await this.prisma.busStop.findFirst({where: {id: parseInt(connection.bustopid_1)}});
            const busStopTo = await this.prisma.busStop.findFirst({where: {id: parseInt(connection.bustopid_2)}});

            const foundConnection = await this.prisma.busStopConnection.findFirst({where: {
                busStopFrom_id: busStopFrom.id,
                busStopTo_id: busStopTo.id,
            }}) 

            const foundConnection2 = await this.prisma.busStopConnection.findFirst({where: {
                busStopFrom_id: busStopTo.id,
                busStopTo_id: busStopFrom.id,
            }})

            if(!foundConnection && !foundConnection2)
            {
                await this.prisma.busStopConnection.create({data:{
                    busStopFrom: {connect: {id: busStopFrom.id}},
                    busStopTo: {connect: {id: busStopTo.id}},
                    time: parseInt(connection.time)
                }})

                const foundBusLineConnection = await this.prisma.busLineConnection.findFirst({where: {StopConnection_From: busStopFrom.id, StopConnection_To: busStopTo.id, busLine_id: busLine.id}});
                if(!foundBusLineConnection){
                    await this.prisma.busLineConnection.create({data: {
                        busLine: {connect: {id: busLine.id}},
                        busStopConnection: {
                            connect: {
                                busStopFrom_id_busStopTo_id : {
                                    busStopFrom_id: busStopFrom.id,
                                    busStopTo_id: busStopTo.id
                            }}},
                        order: parseInt(connection.order),
                    }})
                }
            }
            if(foundConnection)
            {
                const foundBusLineConnection = await this.prisma.busLineConnection.findFirst({where: {busLine_id: busLine.id, StopConnection_From: foundConnection.busStopFrom_id, StopConnection_To: foundConnection.busStopTo_id}})
                if(!foundBusLineConnection){
                    await this.prisma.busLineConnection.create({data: {
                        busLine: {connect: {id: busLine.id}},
                        busStopConnection: {
                            connect: {
                                busStopFrom_id_busStopTo_id: {
                                    busStopFrom_id: foundConnection.busStopFrom_id,
                                    busStopTo_id: foundConnection.busStopTo_id
                                }
                            }},
                        order: parseInt(connection.order),
                    }})
                }
            }
            if(foundConnection2)
            {
                const foundBusLineConnection = await this.prisma.busLineConnection.findFirst({where: {busLine_id: busLine.id, StopConnection_From: foundConnection2.busStopFrom_id, StopConnection_To: foundConnection2.busStopTo_id}})
                if(!foundBusLineConnection){
                    await this.prisma.busLineConnection.create({data: {
                        busLine: {connect: {id: busLine.id}},
                        busStopConnection: {connect: {
                            busStopFrom_id_busStopTo_id: {
                                busStopFrom_id: foundConnection2.busStopFrom_id,
                                busStopTo_id: foundConnection2.busStopTo_id
                            }
                        }},
                        order: parseInt(connection.order),
                    }})
                }
            }
        })
        return ({message: "Pomyślnie utworzono linię autobusową."});
    }

    async returnAllBusLine()
    {
        const busLines = await this.prisma.busLine.findMany();
        return busLines;
    }

    async returnBusLine(id: string)
    {
        const foundBusline = await this.prisma.busLine.findUnique({where: {id : parseInt(id)}});
        if(!foundBusline) throw new BadRequestException(`Nie znaleziono linii!`);

        const foundAllBusLineConnection = await this.prisma.busLineConnection.findMany({where: {busLine_id: parseInt(id)}});
        const sortedConnections = foundAllBusLineConnection.sort((a, b) => a.order - b.order);

        const connections = []
        
        for (const connection of sortedConnections)
        {
            const foundConnection = await this.prisma.busStopConnection.findFirst({where: {busStopFrom_id: connection.StopConnection_From, busStopTo_id: connection.StopConnection_To}, include: {busStopFrom: true, busStopTo: true}});

            const temp = {busStopFromAddress: foundConnection.busStopFrom.address, busStopFromID: foundConnection.busStopFrom_id, busStopToAddress: foundConnection.busStopTo.address, busStopToID: foundConnection.busStopTo_id, time: foundConnection.time};

            connections.push(temp);
        }
        return ({busLine: foundBusline, connections: connections});
        
        
    }

    async deleteBusLine(id: string)
    {
        
        const foundBusline = await this.prisma.busLine.findUnique({where: {id: parseInt(id)}});
        if(!foundBusline) throw new BadRequestException(`Nie znaleziono linii!`);

        await this.prisma.busLineConnection.deleteMany({where: {busLine_id: parseInt(id)}});
        await this.prisma.busLineStop.deleteMany({where: {busLine_id: parseInt(id)}});
        await this.prisma.busLineRoute.deleteMany({where: {busLine_id: parseInt(id)}});
        await this.prisma.busLine.delete({where: {id: parseInt(id)}});


        return {message: `Pomyślnie usunięto linie ${foundBusline.number}!`};
        
    }
}
