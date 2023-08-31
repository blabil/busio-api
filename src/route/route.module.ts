import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [RouteController],
  providers: [RouteService, JwtStrategy]
})
export class RouteModule {}
