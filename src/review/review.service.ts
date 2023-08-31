import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { reviewDto } from './dto/review.dto';
import { Request } from 'express';

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService){}

    async registerReview(dto: reviewDto, req: Request)
    {
        const { isPositive, createdAt, expiresAt, additionalInfo, bus_id } = dto;
        const createdAtD = new Date(createdAt);
        const expiresAtD = new Date(expiresAt);
        const user = req.user as {id:string};

            const monthDifference = (expiresAtD.getFullYear() - createdAtD.getFullYear()) * 12 + (expiresAtD.getMonth() - createdAtD.getMonth());
            if(!(monthDifference >= 12 && monthDifference <= 13)) throw new BadRequestException("Niezgodność daty przeglądu.");
            
            const actualDate = new Date();
            let isActuall = false;
            if(isPositive){
                if(!(actualDate > expiresAtD || actualDate<createdAtD)) isActuall = true;
            }
            if(isActuall == true)
            {
              const reviews = await this.prisma.busReview.findMany({where: {bus_id: parseInt(bus_id), isActuall: true}});
              reviews.forEach(async(review) => {
                await this.prisma.busReview.update({
                  where: {id: review.id},
                  data:{
                    isActuall: false,
                  }
                })
              });
            }
            
            const newBusReviewData = {
                additionalInfo: isPositive ? undefined : additionalInfo,
                isActuall: isActuall,
                isPositive: isPositive,
                bus: {
                  connect: { id: parseInt(bus_id)},
                },
                user: {
                  connect: { id: user.id },
                },
                createdAt: createdAtD,
                expiresAt: isPositive ? expiresAtD : undefined,
              };
        
            await this.prisma.busReview.create({data: newBusReviewData})
            return ({message: "Pomyślnie doddano przegląd"});
    }

    async getBusReviews(id: string)
    {
      const reviews = await this.prisma.busReview.findMany({
        where: {
          bus_id: parseInt(id) },
        orderBy: {
          isActuall: 'desc',
        }
      });
      const bus = await this.prisma.bus.findUnique({where: {id: parseInt(id)}});
      return ({bus, reviews});
    }

    async getUserReviews(id: string)
    {
      const reviews = await this.prisma.busReview.findMany({
        where: {
          user_id: id },
        orderBy: {
          isActuall: 'desc',
        }
      });
      return ({data: reviews});
    }
}
