import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [BusController],
  providers: [BusService, JwtStrategy]
})
export class BusModule {}
