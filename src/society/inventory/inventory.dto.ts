import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export enum InventoryType {
  APARTMENT = 'APARTMENT',
  COMMUNITY_HALL = 'COMMUNITY_HALL',
}

export class CreateInventoryDto extends BaseEntityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(InventoryType)
  kind: InventoryType = InventoryType['APARTMENT'];

  @IsArray()
  @ArrayMinSize(0)
  owners: string[];

  @IsArray()
  @ArrayMinSize(0)
  managers: string[];
}

export class CreatedInventoryDto extends CreateInventoryDto
  implements CreatedBaseEntity {
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

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(InventoryType)
  kind: InventoryType = InventoryType['APARTMENT'];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  owners: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  managers: string[];
}
