import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BreakdownService } from './breakdown.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { breakDownDto } from './dto/breakDown.dto';
import { Request } from 'express';
import { breakDownModifyDto } from './dto/breakDownModify.dto';

@Controller('breakdown')
export class BreakdownController {
  constructor(private readonly breakdownService: BreakdownService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  registerBreakDown(@Body() dto: breakDownDto , @Req() req: Request)
  {
    return this.breakdownService.registerBreakDown(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBusBreakDowns(@Param() params: {id: string})
  {
    return this.breakdownService.getBusBreakDowns(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('mechanic/:id')
  getBreakDown(@Param() params: {id: string})
  {
    return this.breakdownService.getBreakDown(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getUserBreakDowns(@Param() params: {id: string})
  {
    return this.breakdownService.getUserBreakDowns(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('modify')
  registerBreakDownModify(@Body() dto: breakDownModifyDto, @Req() req: Request)
  {
    return this.breakdownService.registerBreakDownModify(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bus/modify/:id')
  getBusModifyList(@Param() params: {id: string})
  {
    return this.breakdownService.getBusModifyList(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/modify/:id')
  getUserModifyList(@Param() params: {id: string})
  {
    return this.breakdownService.getUserModifyList(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('solve/:id')
  markSolved(@Param() params: {id: string}, @Req() req : Request)
  {
    return this.breakdownService.markSolved(params.id, req);
  }
}
