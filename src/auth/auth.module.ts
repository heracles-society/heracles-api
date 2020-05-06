import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleOauth2Strategy } from './google.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleConfig from './google.config';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule.forFeature(googleConfig)],
  providers: [AuthService, GoogleOauth2Strategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
