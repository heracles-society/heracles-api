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
  @IsNotEmpty()
  @IsEnum(ApplicationKind)
  kind: ApplicationKind = ApplicationKind.ONBOARDING;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsEnum(ApplicationPriority)
  priority: ApplicationPriority = ApplicationPriority.NORMAL;
  @IsNotEmpty()
  @IsString()
  raisedBy: string;
}

export class CreatedApplicationDto extends CreateApplicationDto
  implements CreatedBaseEntity {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
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

export class UpdateApplicationDto extends CreateApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationKind)
  kind: ApplicationKind = ApplicationKind.ONBOARDING;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsEnum(ApplicationPriority)
  priority: ApplicationPriority;
  @IsOptional()
  @IsString()
  raisedBy: string;
}
