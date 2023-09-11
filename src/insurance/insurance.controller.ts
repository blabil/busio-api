import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
    return this.insuranceService.registerInsurance(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bus/:id')
  getBusInsurance(@Param() params: {id: string})
  {
    return this.insuranceService.getBusInsurance(params.id);
  }
  
}
