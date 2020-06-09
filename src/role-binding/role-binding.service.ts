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
    const { data: roles } = await this.roleService.find(
      {
        $or: [
          {
            'rules.resourceKind': resourceKind,
            'rules.resources': resourceId,
            'rules.actions': action,
          },
          {
            'rules.resourceKind': resourceKind,
            'rules.resources': { $size: 0 },
            'rules.actions': action,
          },
        ],
      },
      { skip: 0, limit: 50 },
    );
    if (roles.length > 0) {
      const { total } = await this.find(
        {
          $or: [
            {
              kind: RoleBindingKind.NAMESPACED,
              namespace,
              'subjects.id': subjectId,
              'roles.id': { $in: roles.map(role => role.id) },
            },
            {
              kind: RoleBindingKind.GLOBAL,
              'subjects.id': subjectId,
              'roles.id': { $in: roles.map(role => role.id) },
            },
          ],
        },
        { skip: 0, limit: 50 },
      );

      return total > 0;
    }
    return false;
  }
}
