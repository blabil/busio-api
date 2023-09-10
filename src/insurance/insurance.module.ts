import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [InsuranceController],
  providers: [InsuranceService, JwtStrategy]
})
export class InsuranceModule {}
