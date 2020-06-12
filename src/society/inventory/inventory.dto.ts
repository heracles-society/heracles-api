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
  id: string;
  society: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
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
