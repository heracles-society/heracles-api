import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
export enum RoleKind {
  GLOBAL = 'GLOBAL',
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
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEnum(RoleKind)
  kind: RoleKind = RoleKind.GLOBAL;
  @IsArray()
  @IsNotEmpty()
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

export class UpdateRoleDto extends CreateRoleDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsEnum(RoleKind)
  kind: RoleKind = RoleKind.GLOBAL;
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Rule)
  rules: Rule[];
}
