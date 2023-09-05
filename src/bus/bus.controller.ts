import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getBusProfile(@Param() params: {id: string}){
    return this.busService.getBusProfile(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buses/:id')
  getBusAviableBuses(@Param() params: {id: string}){
    return this.busService.getAvialbleBuses(params.id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('assign/:id')
  assignDriverToRoute(@Param('id') id: string, @Body() body){
    return this.busService.assignBusToRoute(id, body.busID);
  }
}
