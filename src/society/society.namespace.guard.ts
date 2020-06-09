import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleBindingService } from '../role-binding/role-binding.service';

@Injectable()
export class SocietyNamespaceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleBindingService: RoleBindingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let resourceKind = this.reflector.get<string>(
      'ResourceKind',
      context.getHandler(),
    );

    if (!resourceKind) {
      resourceKind = this.reflector.get<string>(
        'ResourceKind',
        context.getClass(),
      );
    }

    const user = request.user;
    const societyId = request.params.societyId;
    if (!societyId || !user) {
      return false;
    }

    const action = this.reflector.get<string>('action', context.getHandler());

    const hasPermission = await this.roleBindingService.validatePermission({
      namespace: societyId,
      resourceKind: resourceKind,
      resourceId: request.params.id,
      subjectId: user.id,
      action: action,
    });

    return hasPermission;
  }
}
