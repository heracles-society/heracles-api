import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSecretRequestType } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (requestType: JwtSecretRequestType) => {
        switch (requestType) {
          case JwtSecretRequestType.SIGN:
            // retrieve signing key dynamically
            return configService.get('JWT_PRIVATE_KEY');
          case JwtSecretRequestType.VERIFY:
            // retrieve public key for verification dynamically
            return configService.get('JWT_PUBLIC_KEY');
          default:
            // retrieve secret dynamically
            return configService.get('JWT_SECRET');
        }
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const { sub: userId, email, scopes: roles } = payload;
    return {
      id: userId,
      email,
      roles,
    };
  }
}
