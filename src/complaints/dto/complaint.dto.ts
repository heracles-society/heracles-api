import { OmitType } from '@nestjs/swagger';

export const enum ComplaintType {
  NORMAL = 'NORMAL',
}

export const enum ComplaintStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REOPENED = 'REOPENED',
}

export class CreateComplaintDto {
  name: string;
  type: ComplaintType = ComplaintType.NORMAL;
  priority = 10;
  society: string;
  user: string;
}

export class CreatedComplaintDto extends OmitType(CreateComplaintDto, [
  '_id',
]) {}
