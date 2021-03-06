import { baseControllerFactory } from '../utils/base-module/base.controller';
import {
  CreateRoleBindingDto,
  UpdateRoleBindingDto,
  CreatedRoleBindingDto,
} from './role-binding.dto';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { RoleBindingService } from './role-binding.service';
import { RoleBinding } from './role-binding.model';
import { ROLE_BINDING_MODEL } from './constants';

const BaseRoleBindingController = baseControllerFactory<RoleBinding>({
  modelName: ROLE_BINDING_MODEL,
  entity: RoleBinding,
  createEntitySchema: CreateRoleBindingDto,
  patchEntitySchema: UpdateRoleBindingDto,
  createdEntitySchema: CreatedRoleBindingDto,
});

@ApiTags('role-bindings')
@Controller('role-bindings')
export class RoleBindingController extends BaseRoleBindingController {
  constructor(roleService: RoleBindingService) {
    super(roleService);
  }
}
