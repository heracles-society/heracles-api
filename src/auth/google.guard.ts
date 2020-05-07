import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleBearerGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      return false;
    }

    const accessToken = bearerToken.split('Bearer ')[1];
    if (!accessToken) {
      return false;
    }

    const isTokenValid = await this.authService.verifyAccessToken(accessToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Bearer token invalid');
    }

    return true;
  }
}
