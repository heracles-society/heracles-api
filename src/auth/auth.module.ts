import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleOauth2Strategy } from './google.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import googleConfig from './google.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    PassportModule,
    ConfigModule.forFeature(googleConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '3h',
          issuer: 'Heracles API',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, GoogleOauth2Strategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
