import { Module } from '@nestjs/common';
import { DriverService } from './worker.service';
import { DriverController } from './worker.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [DriverController],
  providers: [DriverService, JwtStrategy]
})
export class DriverModule {}
