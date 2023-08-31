import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RouteService } from './route.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { busLineRouteDto } from './dto/busLineRoute.dto';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  createRoute(@Body() dto: busLineRouteDto)
  {
    return this.routeService.createRoute(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('getall/:id')
  returnAllRoutes(@Param() params: {id: string})
  {
    return this.routeService.getAllRoutes(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getone/:id')
  returnOneRoute(@Param() params: {id: string})
  {
    return this.routeService.returnOneRoute(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getdrivers/:id')
  returnAllDrivers(@Param() params: {id: string})
  {
    return
  }

  @UseGuards(JwtAuthGuard)
  @Get('getroute/:id')
  returnRoute(@Param() params: {id: string})
  {
    return this.routeService.returnRoute(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getroutedriver/:id')
  returnRouteDriver(@Param() params: {id: string})
  {
    return this.routeService.returnRouteDriver(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateuser(@Param('id') id: string, @Body() body){
    return this.routeService.updateRoute(id, body.driverID);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('route/:id')
  deleteRoute(@Param('id') id : string){
    return this.routeService.deleteRoute(id);
  }
}

