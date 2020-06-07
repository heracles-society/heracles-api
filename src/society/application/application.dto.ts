import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';
export enum ApplicationKind {
  ONBOARDING = 'ONBOARDING',
  GYM_ACCESS = 'GYM_ACCESS',
  POOL_ACCESS = 'POOL_ACCESS',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum ApplicationPriority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
}

export class CreateApplicationDto extends BaseEntityDto {
  kind: ApplicationKind = ApplicationKind.ONBOARDING;
  description: string;
  priority: ApplicationPriority = ApplicationPriority.NORMAL;
  raisedBy: string;
}

export class CreatedApplicationDto extends CreateApplicationDto
  implements CreatedBaseEntity {
  status: string;
  assignedTo?: string;
  id: string;
  society: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
