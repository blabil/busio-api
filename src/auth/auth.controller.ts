import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthoDto } from './dto/signUpAuth.dto';
import { SignInAuthoDto } from './dto/signInAuth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpAuthoDto){
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SignInAuthoDto){
    return this.authService.signin(dto);
  }

  @Get('logout')
  logout(@Res() res){
    this.authService.logout(res);
  }

  @Get(':id')
  getRole(@Param() params: {id: string}){
    return "TEST";
  }
}
