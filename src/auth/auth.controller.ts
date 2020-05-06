import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2 } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @ApiOAuth2([
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ])
  @UseGuards(AuthGuard('google'))
  @Get('google/login')
  async login(@Request() req) {
    return req.user;
  }

  @ApiOAuth2([
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ])
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async handleGoogleCallback(@Request() req) {
    return req.user;
  }
}
