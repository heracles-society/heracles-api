import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../utils/base-module/base.service';
import { RoleBinding } from './role-binding.model';
import { ROLE_BINDING_PROVIDER } from './constants';
import { Model } from 'mongoose';
import { RoleService } from '../role/role.service';
import { RoleBindingKind } from './role-binding.dto';

interface IRoleBindingValidateQuery {
  namespace: RoleBindingKind;
  subjectId: string;
  action: string;
  resourceKind: string;
  resourceId?: string;
}

@Injectable()
export class RoleBindingService extends BaseService<RoleBinding> {
  constructor(
    @Inject(ROLE_BINDING_PROVIDER) roleBindingModel: Model<RoleBinding>,
    public roleService: RoleService,
  ) {
    super(roleBindingModel);
  }

  async validatePermission({
    namespace,
    subjectId,
    action,
    resourceKind,
    resourceId,
  }: IRoleBindingValidateQuery): Promise<boolean> {
    const roles = await this.roleService.find(
      {
        $and: [
          {
            resourceKind,
            resources: resourceId ? resourceId : { $size: 0 },
            actions: action,
          },
        ],
      },
      { skip: 0, limit: 50 },
    );
    const roleBindings = await this.find({
      $and: [
        {
          kind: RoleBindingKind.NAMESPACED,
          namespace,
          'subjects.id': subjectId,
          'roles.id': roles.data.map(role => role.id),
        },
      ],
    });

    return roleBindings.total > 0;
  }
}
