import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export class CreateEventDto extends BaseEntityDto {
  name: string;
  kind: string;
  description: string;
  society: string;
  createdBy: string;
}

export class CreatedEventDto extends CreateEventDto
  implements CreatedBaseEntity {
  id: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
