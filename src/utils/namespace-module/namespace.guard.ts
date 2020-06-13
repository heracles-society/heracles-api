import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleBindingService } from '../../role-binding/role-binding.service';

@Injectable()
export class NamespaceGuard implements CanActivate {
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

    let namespaceKey = this.reflector.get<string>(
      'NamespaceKey',
      context.getHandler(),
    );

    if (!namespaceKey) {
      namespaceKey = this.reflector.get<string>(
        'NamespaceKey',
        context.getClass(),
      );
    }
    const user = request.user;
    if (!user) {
      return false;
    }

    const namespace = request.params[namespaceKey];
    const action = this.reflector.get<string>('action', context.getHandler());

    const hasNamespaceAccess = await this.roleBindingService.hasNamespaceAccess(
      {
        action,
        resourceKind,
        namespace,
        subjectId: user.id,
      },
    );

    return hasNamespaceAccess;
  }
}
