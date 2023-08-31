import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { IssueService } from './issue.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { issueDto } from './dto/issue.dto';
import { Request } from 'express';
import { issueModifyDto } from './dto/issueModify.dto';


@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  registerIssue(@Body() dto: issueDto, @Req() req: Request)
  {
    return this.issueService.registerIssue(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBusIssues(@Param() params: {id: string})
  {
    return this.issueService.getBusIssues(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mechanic/:id')
  getIssue(@Param() params: {id: string})
  {
    return this.issueService.getIssue(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getUserIssues(@Param() params: {id: string})
  {
    return this.issueService.getUserIssues(params.id);
  }


  @UseGuards(JwtAuthGuard)
  @Post('modify')
  registerIssueModify(@Body() dto: issueModifyDto, @Req() req: Request)
  {
    return this.issueService.registerIssueModify(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bus/modify/:id')
  getBusModifyList(@Param() params: {id: string}){
    return this.issueService.getBusModifyList(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/modify/:id')
  getUserModifyList(@Param() params: {id: string}){
    return this.issueService.getUserModifyList(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('solve/:id')
  markSolved(@Param() params: {id: string}, @Req() req : Request)
  {
    return this.issueService.markSolved(params.id, req);
  }
}
