import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { BusstopService } from './busstop.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('busstop')
export class BusstopController {
  constructor(private readonly busstopService: BusstopService) {}


  @UseGuards(JwtAuthGuard)
  @Post('register')
  registerBusStop(@Body() address )
  {
    return this.busstopService.registerBusStop(address.address);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stops')
  returnAllBusStops()
  {
    return this.busstopService.returnAllBusStops();   
  }

  @UseGuards(JwtAuthGuard)
  @Get('buslines/:id')
  returnStopBusLines(@Param() params: {id: string})
  {
    return this.busstopService.returnStopBusLines(params.id);   
  }

  @UseGuards(JwtAuthGuard)
  @Get('connections/:id')
  returnStopBusConnections(@Param() params: {id: string})
  {
    return this.busstopService.returnStopBusConnections(params.id);   
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  returnBusStop(@Param() params: {id: string})
  {
    return this.busstopService.returnBusStop(params.id);   
  }


  @UseGuards(JwtAuthGuard)
  @Get('/:busstop1/:busstop2')
  returnBusStopConectionTime(@Param('busstop1') param1: string, @Param('busstop2') param2: string){
    return this.busstopService.returnBusStopConectionTime(param1, param2);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateBusStop(@Param('id') id: string, @Body() body ){
    return this.busstopService.updateBusStop(id, body.address);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updatetimeconnection/:id')
  updateStopTimeConnection(@Param('id') id: string, @Body() body ){
    return this.busstopService.updateStopTimeConnection(id, body.busStopToID, body.connectionTime);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteStop(@Param() params: {id: string} ){
    return this.busstopService.deleteStop(params.id);
  }

}
