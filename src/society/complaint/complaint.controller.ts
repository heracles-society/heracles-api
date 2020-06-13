import { Controller, SetMetadata } from '@nestjs/common';

import {
  CreateComplaintDto,
  CreatedComplaintDto,
  UpdateComplaintDto,
} from './complaint.dto';

import { ApiTags } from '@nestjs/swagger';

import { ComplaintService } from './complaint.service';
import { COMPLAINT_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { Complaint } from './complaint.model';
import { namespaceBaseControllerFactory } from '../../utils/namespace-module/namespace.base.controller';

const BaseSocietyNamespacedComplaintController = namespaceBaseControllerFactory<
  Complaint
>({
  namespaceParam: 'societyId',
  namespaceKey: 'society',
  modelName: COMPLAINT_MODEL,
  createEntitySchema: CreateComplaintDto,
  createdEntitySchema: CreatedComplaintDto,
  patchEntitySchema: UpdateComplaintDto,
});

@ApiTags('complaints')
@Controller('societies/:societyId/complaints')
@SetMetadata('ResourceKind', COMPLAINT_MODEL)
@SetMetadata('NamespaceKey', 'societyId')
export class ComplaintController extends BaseSocietyNamespacedComplaintController {
  constructor(
    complaintService: ComplaintService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(complaintService, roleService, roleBindingService);
  }
}
