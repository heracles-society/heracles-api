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

export class CreateComplaintDto {
  kind: ComplaintKind = ComplaintKind.NORMAL;
  description: string;
  priority: ComplaintPriority = ComplaintPriority.NORMAL;
  society: string;
  raisedBy: string;
}

export class CreatedComplaintDto extends CreateComplaintDto {
  status: string;
  assignedTo: string;
}

export class PatchComplaintDto extends PartialType(CreatedComplaintDto) {}
