import { baseControllerFactory } from '../utils/base-module/base.controller';
import { CreateRoleDto, UpdateRoleDto, CreatedRoleDto } from './role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.model';

const BaseRoleController = baseControllerFactory<Role>({
  name: 'roles',
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
