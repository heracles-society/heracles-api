import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../utils/base-module/base.service';
import { Role } from './role.model';
import { ROLE_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(@Inject(ROLE_PROVIDER) roleModel: Model<Role>) {
    super(roleModel);
  }
}
