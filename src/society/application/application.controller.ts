import { Controller, SetMetadata } from '@nestjs/common';

import {
  CreateApplicationDto,
  CreatedApplicationDto,
  UpdateApplicationDto,
} from './application.dto';

import { ApiTags } from '@nestjs/swagger';

import { ApplicationService } from './application.service';
import { APPLICATION_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { namespaceBaseControllerFactory } from '../../utils/namespace-module/namespace.base.controller';
import { Application } from './application.model';

const BaseSocietyNamespacedApplicationController = namespaceBaseControllerFactory<
  Application
>({
  modelName: APPLICATION_MODEL,
  createEntitySchema: CreateApplicationDto,
  createdEntitySchema: CreatedApplicationDto,
  patchEntitySchema: UpdateApplicationDto,
});

@ApiTags('applications')
@Controller('societies/:societyId/applications')
@SetMetadata('ResourceKind', APPLICATION_MODEL)
@SetMetadata('NamespaceKey', 'societyId')
export class ApplicationController extends BaseSocietyNamespacedApplicationController {
  constructor(
    applicationService: ApplicationService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(applicationService, roleService, roleBindingService);
  }
}
