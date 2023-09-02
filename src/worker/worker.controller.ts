import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getWorkers(){
    return this.workerService.getWorkers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getWorker(@Param() params: {id: string}){
    return this.workerService.getWorker(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('drivers/:id')
  getDrivers(@Param() params: {id: string})
  {
    return this.workerService.getDrivers(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('assign/:id')
  assignDriverToRoute(@Param('id') id: string, @Body() body){
    return this.workerService.assignDriverToRoute(id, body.driverID);
  }
}
