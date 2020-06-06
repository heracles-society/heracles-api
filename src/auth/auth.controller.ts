import { Controller, UseGuards, Request, Get, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { GoogleBearerGuard } from './google.guard';
import { AuthService, AuthJwtToken } from './auth.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  @Get('google/login')
  async login(@Request() req) {
    return req.user;
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async handleGoogleCallback(@Request() req): Promise<AuthJwtToken> {
    return this.authService.generateToken(req.user);
  }

  @UseGuards(GoogleBearerGuard)
  @ApiOAuth2([
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ])
  @Post('google/token')
  async handleGoogleBearerToken(@Request() req): Promise<AuthJwtToken> {
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const user = await this.authService.findOrCreateUserFromAccessToken(
      accessToken,
    );
    const authJwtToken = this.authService.generateToken(user);
    return authJwtToken;
  }

  @Get('.well-knowns/public_key')
  async exposePublicKey(): Promise<string> {
    return this.configService.get('JWT_PUBLIC_KEY');
  }
}
