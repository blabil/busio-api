import { Module } from '@nestjs/common';
import { BusstopService } from './busstop.service';
import { BusstopController } from './busstop.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [BusstopController],
  providers: [BusstopService, JwtStrategy]
})
export class BusstopModule {}
