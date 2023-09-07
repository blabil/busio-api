import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BuslineService } from './busline.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { busLineRegistrationDto } from './dto/busLineRegistration.dto';
import { BusLineAddStopDto } from './dto/busLineAddBusStop.dto';

@Controller('busline')
export class BuslineController {
  constructor(private readonly buslineService: BuslineService) {}


  @UseGuards(JwtAuthGuard)
  @Post('register')
  registerBusLine(@Body() dto :busLineRegistrationDto)
  {
    return this.buslineService.registerBusLine(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addstop')
  addStop(@Body() dto :BusLineAddStopDto)
  {
    return this.buslineService.addStop(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('all')
  returnAllBusLine()
  {
    return this.buslineService.returnAllBusLine();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  returnBusLine(@Param() params: {id: string})
  {
    return this.buslineService.returnBusLine(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stops/:id')
  returnBusLineStops(@Param() params: {id: string})
  {
    return this.buslineService.returnBusLineStops(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stops/fl/:id')
  returnBusLineStopsFirsLast(@Param() params: {id: string})
  {
    return this.buslineService.returnBusLineStopsFirsLast(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBusLine(@Param('id') id: string)
  {
    return this.buslineService.deleteBusLine(id);
  }
}
