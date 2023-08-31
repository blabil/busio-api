import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BusService } from './bus.service';
import { busRegistrationDto } from './dto/busRegistration.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';


@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  registerBus(@Body() dto: busRegistrationDto){
    return this.busService.registerBus(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getBuses(){
    return this.busService.getBuses();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBus(@Param() params: {id: string}){
    return this.busService.getBus(params.id);
  }
}
