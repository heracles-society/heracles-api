import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
export enum RoleKind {
  GLOBAL = 'GLOBAL',
  NAMESPACED = 'NAMESPACED',
}

export class Rule {
  @IsNotEmpty()
  resourceKind: string;
  @IsArray()
  @IsOptional()
  resources: string[];
  @IsArray()
  @ArrayMinSize(1)
  actions: string[];
}

export class CreateRoleDto extends BaseEntityDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  kind: RoleKind = RoleKind.GLOBAL;
  @IsOptional()
  namespace?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Rule)
  rules: Rule[];
}

export class CreatedRoleDto extends CreateRoleDto implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
