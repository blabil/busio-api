import { Module } from '@nestjs/common';
import { BuslineService } from './busline.service';
import { BuslineController } from './busline.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [BuslineController],
  providers: [BuslineService, JwtStrategy]
})
export class BuslineModule {}
