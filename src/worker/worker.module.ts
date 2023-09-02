import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, JwtStrategy]
})
export class WorkerModule {}
