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
  IsNumber,
  IsObject,
  IsNotEmptyObject,
} from 'class-validator';

export enum OrderKind {
  NORMAL = 'NORMAL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class CreateOrderDto extends BaseEntityDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  createdFor: string;
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}

export class CreatedOrderDto extends CreateOrderDto
  implements CreatedBaseEntity {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @IsNotEmptyObject()
  @IsObject()
  metadata: object;
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

export class UpdateOrderDto extends CreateOrderDto {
  @IsOptional()
  @IsNumber()
  amount: number;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  createdFor: string;
  @IsOptional()
  @IsString()
  createdBy: string;
}
