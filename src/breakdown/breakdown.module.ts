import { Module } from '@nestjs/common';
import { BreakdownService } from './breakdown.service';
import { BreakdownController } from './breakdown.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [BreakdownController],
  providers: [BreakdownService, JwtStrategy]
})
export class BreakdownModule {}
