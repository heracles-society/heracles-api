import { PartialType } from '@nestjs/swagger';
export enum EventStatus {
  PENDING = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
export class CreateEventDto {
  name: string;
  description: string;
  reservation?: string;
  createdBy: string;
}
export class CreatedEventDto extends CreateEventDto {
  status: EventStatus;
}
export class PatchEventDto extends PartialType(CreatedEventDto) {}
