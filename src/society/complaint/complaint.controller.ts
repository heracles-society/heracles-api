import { Controller, applyDecorators } from '@nestjs/common';
import {
  CreateComplaintDto,
  CreatedComplaintDto,
  UpdateComplaintDto,
} from './complaint.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Complaint } from './complaint.model';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';

const BaseComplaintController = baseControllerFactory<Complaint>({
  name: 'inventories',
  routeDecorators: () =>
    applyDecorators(
      ApiParam({
        name: 'societyId',
        required: true,
        type: String,
      }),
    ),
  entity: Complaint,
  createEntitySchema: CreateComplaintDto,
  patchEntitySchema: UpdateComplaintDto,
  createdEntitySchema: CreatedComplaintDto,
});

@ApiTags('inventories')
@Controller('societies/:societyId/inventories')
export class ComplaintController extends BaseComplaintController {
  constructor(complaintService: ComplaintService) {
    super(complaintService);
  }
}
