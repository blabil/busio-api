import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { SignUpAuthoDto } from 'src/auth/dto/signUpAuth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param() params: {id: string}, @Req() req){
    return this.usersService.getUser(params.id, req);
  }

  @Get()
  getUsers(){
    return this.usersService.getUsers();
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteuser(@Param('id') id: string, @Res() res){
    return this.usersService.deleteUser(id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateuser(@Param('id') id: string, @Body() dto: SignUpAuthoDto, @Res() res){
    return this.usersService.updateUser(id, dto, res);
  }

}
