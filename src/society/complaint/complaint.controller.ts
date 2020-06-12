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
import { societyBaseNamespaceControllerFactory } from '../society.base.namespace.controller';
import { Complaint } from './complaint.model';

const BaseSocietyNamespacedComplaintController = societyBaseNamespaceControllerFactory<
  Complaint
>({
  modelName: COMPLAINT_MODEL,
  createEntitySchema: CreateComplaintDto,
  createdEntitySchema: CreatedComplaintDto,
  patchEntitySchema: UpdateComplaintDto,
});

@ApiTags('complaints')
@Controller('societies/:societyId/complaints')
@SetMetadata('ResourceKind', COMPLAINT_MODEL)
export class ComplaintController extends BaseSocietyNamespacedComplaintController {
  constructor(
    complaintService: ComplaintService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(complaintService, roleService, roleBindingService);
  }
}
