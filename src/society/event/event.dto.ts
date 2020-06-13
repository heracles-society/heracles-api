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

export enum EventKind {
  NORMAL = 'NORMAL',
}

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export class CreateEventDto extends BaseEntityDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEnum(EventKind)
  kind: EventKind = EventKind.NORMAL;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}

export class CreatedEventDto extends CreateEventDto
  implements CreatedBaseEntity {
  @IsNotEmpty()
  @IsEnum(EventStatus)
  status: EventStatus;
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

export class UpdateEventDto extends CreateEventDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsEnum(EventKind)
  kind: EventKind = EventKind.NORMAL;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  createdBy: string;
}
