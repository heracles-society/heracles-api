import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';

import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export enum ReservationKind {
  LEASE = 'LEASE',
  RENT = 'RENT',
  NORMAL = 'NORMAL',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class CreateReservationDto extends BaseEntityDto {
  @IsNotEmpty()
  @IsEnum(ReservationKind)
  kind: ReservationKind.NORMAL;
  @IsNotEmpty()
  @IsString()
  inventory: string;
  @IsNotEmpty()
  @IsDateString()
  fromDate: Date;
  @IsNotEmpty()
  @IsDateString()
  toDate: Date;
  @IsNotEmpty()
  @IsString()
  reservedBy: string;
}

export class CreatedReservationDto extends CreateReservationDto
  implements CreatedBaseEntity {
  @IsNotEmpty()
  @IsEnum(ReservationStatus)
  status: string;
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

export class UpdateReservationDto extends CreateReservationDto {
  @IsOptional()
  @IsEnum(ReservationKind)
  kind: ReservationKind.NORMAL;
  @IsOptional()
  @IsString()
  inventory: string;
  @IsOptional()
  @IsDateString()
  fromDate: Date;
  @IsOptional()
  @IsDateString()
  toDate: Date;
  @IsOptional()
  @IsString()
  reservedBy: string;
}
