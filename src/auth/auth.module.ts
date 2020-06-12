import { Module, HttpModule } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleOauth2Strategy } from './google.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import googleConfig from './google.config';
import { JwtStrategy } from './jwt.strategy';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    HttpModule,
    UserModule,
    PassportModule,
    ConfigModule.forFeature(googleConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('JWT_PRIVATE_KEY'),
          publicKey: configService.get('JWT_PUBLIC_KEY'),
          signOptions: {
            expiresIn: '3h',
            issuer: 'Heracles API',
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    RoleModule,
  ],
  providers: [AuthService, GoogleOauth2Strategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
