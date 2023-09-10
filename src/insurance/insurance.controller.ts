import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { insuranceDto } from './dto/registerInsurance.dto';
import { Request } from 'express';

@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  registerInsurance(@Body() dto: insuranceDto, @Req() req: Request)
  {
    console.log(dto)
    return this.insuranceService.registerInsurance(dto, req);
  }
  
}
