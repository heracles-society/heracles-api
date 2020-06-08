import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SocietyService } from './society.service';
import { RoleBindingService } from '../role-binding/role-binding.service';
import { SOCIETY_MODEL } from './constants';
import { RoleBindingKind } from '../role-binding/role-binding.dto';

@Injectable()
export class SocietyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private societyService: SocietyService,
    private roleBindingService: RoleBindingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    debugger;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const societyId = request.params.societyId;
    if (!societyId || !user) {
      return false;
    }

    const hasPermission = await this.roleBindingService.validatePermission({
      namespace: RoleBindingKind.NAMESPACED,
      resourceKind: SOCIETY_MODEL,
      resourceId: societyId,
      subjectId: user.id,
      action: 'GET',
    });

    return hasPermission;
  }
}
