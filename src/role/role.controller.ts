import { baseControllerFactory } from '../utils/base-module/base.controller';
import { CreateRoleDto, UpdateRoleDto, CreatedRoleDto } from './role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.model';
import { ROLE_MODEL } from './constants';

const BaseRoleController = baseControllerFactory<Role>({
  modelName: ROLE_MODEL,
  entity: Role,
  createEntitySchema: CreateRoleDto,
  patchEntitySchema: UpdateRoleDto,
  createdEntitySchema: CreatedRoleDto,
});

@ApiTags('roles')
@Controller('roles')
export class RoleController extends BaseRoleController {
  constructor(roleService: RoleService) {
    super(roleService);
  }
}
