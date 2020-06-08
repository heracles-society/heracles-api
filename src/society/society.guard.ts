import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SocietyService } from './society.service';

@Injectable()
export class SocietyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private societyService: SocietyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    debugger;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const societyId = request.params.societyId;
    if (!societyId || !user) {
      return false;
    }
    return true;
  }
}
