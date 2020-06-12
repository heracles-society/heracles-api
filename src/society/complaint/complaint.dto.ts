import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';
export enum ComplaintKind {
  NORMAL = 'NORMAL',
}

export enum ComplaintStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REOPENED = 'REOPENED',
}

export enum ComplaintPriority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
}

export class CreateComplaintDto extends BaseEntityDto {
  kind: ComplaintKind = ComplaintKind.NORMAL;
  description: string;
  priority: ComplaintPriority = ComplaintPriority.NORMAL;
  raisedBy: string;
}

export class CreatedComplaintDto extends CreateComplaintDto
  implements CreatedBaseEntity {
  status: string;
  assignedTo?: string;
  id: string;
  society: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateComplaintDto extends PartialType(CreateComplaintDto) {}
