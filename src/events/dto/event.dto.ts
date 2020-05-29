import { PartialType } from '@nestjs/swagger';
export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export class CreateEventDto {
  name: string;
  kind: string;
  description: string;
  society: string;
  createdBy: string;
}

export class CreatedEventDto extends CreateEventDto {
  status: EventStatus;
}
export class PatchEventDto extends PartialType(CreatedEventDto) {}
