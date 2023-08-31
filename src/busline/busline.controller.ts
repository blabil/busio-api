import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BuslineService } from './busline.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { busLineRegistrationDto } from './dto/busLineRegistration.dto';

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
  @Delete(':id')
  deleteBusLine(@Param('id') id: string)
  {
    return this.buslineService.deleteBusLine(id);
  }
}
