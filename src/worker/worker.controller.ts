import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DriverService } from './worker.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('worker')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getWorkers(){
    return this.driverService.getWorkers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getWorker(@Param() params: {id: string}){
    return this.driverService.getWorker(params.id);
  }
}
