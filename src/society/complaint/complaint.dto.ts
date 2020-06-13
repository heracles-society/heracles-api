import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';

import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

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
  @IsNotEmpty()
  @IsEnum(ComplaintKind)
  kind: ComplaintKind = ComplaintKind.NORMAL;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsEnum(ComplaintPriority)
  priority: ComplaintPriority = ComplaintPriority.NORMAL;
  @IsNotEmpty()
  @IsString()
  raisedBy: string;
}

export class CreatedComplaintDto extends CreateComplaintDto
  implements CreatedBaseEntity {
  @IsNotEmpty()
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;
  @IsOptional()
  @IsString()
  assignedTo?: string;
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  society: string;
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;
  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;
}

export class UpdateComplaintDto extends CreateComplaintDto {
  @IsOptional()
  @IsEnum(ComplaintKind)
  kind: ComplaintKind = ComplaintKind.NORMAL;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsEnum(ComplaintPriority)
  priority: ComplaintPriority = ComplaintPriority.NORMAL;
  @IsOptional()
  @IsString()
  raisedBy: string;
}
