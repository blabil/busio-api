import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BusModule } from './bus/bus.module';
import { WorkerModule } from './worker/worker.module';
import { IssueModule } from './issue/issue.module';
import { BusstopModule } from './busstop/busstop.module';
import { BuslineModule } from './busline/busline.module';
import { RouteModule } from './route/route.module';
import { BreakdownModule } from './breakdown/breakdown.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, BusModule, WorkerModule, IssueModule, BusstopModule, BuslineModule, RouteModule, BreakdownModule, ReviewModule],
})
export class AppModule {}
