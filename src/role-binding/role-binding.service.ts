import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../utils/base-module/base.service';
import { RoleBinding } from './role-binding.model';
import { ROLE_BINDING_PROVIDER } from './constants';
import { Model } from 'mongoose';
import { RoleService } from '../role/role.service';
import { RoleBindingKind } from './role-binding.dto';

interface IPermittedResourceQueryParmas {
  namespace: string;
  subjectId: string;
  action: any;
  resourceKind: string;
}

interface IPermittedResourceResponse {
  all: boolean;
  resourceIds: string[];
}

interface IRoleBindingValidateQuery extends IPermittedResourceQueryParmas {
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

  async hasNamespaceAccess(
    params: IPermittedResourceQueryParmas,
  ): Promise<boolean> {
    const { subjectId, namespace, resourceKind, action } = params;
    const boundRoles = await this.distinct('roles.id', {
      $and: [
        {
          'subjects.id': subjectId,
          namespace,
        },
      ],
    });
    if (boundRoles) {
      const data = await this.roleService.findOne({
        $and: [
          {
            'rules.resourceKind': resourceKind,
            'rules.actions': action,
            _id: {
              $in: boundRoles,
            },
          },
        ],
      });
      if (data) {
        return true;
      }
    }
    return false;
  }

  async validatePermission(
    params: IRoleBindingValidateQuery,
  ): Promise<boolean> {
    const { namespace, subjectId, action, resourceKind, resourceId } = params;
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

  async getPermittedResources(
    params: IPermittedResourceQueryParmas,
  ): Promise<IPermittedResourceResponse> | null {
    const { namespace, resourceKind, subjectId, action } = params;
    const boundRoles = await this.distinct('roles.id', {
      $and: [
        {
          kind: RoleBindingKind.NAMESPACED,
          namespace,
          'subjects.id': subjectId,
        },
      ],
    });
    if (boundRoles.length > 0) {
      const data = await this.roleService.findOne({
        $and: [
          {
            'rules.resourceKind': resourceKind,
            'rules.actions': action,
            'rules.resources': { $size: 0 },
          },
        ],
      });
      if (data) {
        return {
          all: true,
          resourceIds: [],
        };
      } else {
        const data = await this.roleService.distinct('rules.resources', {
          $and: [
            {
              'rules.resourceKind': resourceKind,
              'rules.actions': action,
              _id: {
                $in: boundRoles,
              },
            },
          ],
        });
        return {
          all: false,
          resourceIds: data,
        };
      }
    }
    return {
      all: false,
      resourceIds: [],
    };
  }
}
