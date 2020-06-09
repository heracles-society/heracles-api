import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum RoleBindingKind {
  GLOBAL = 'GLOBAL',
  NAMESPACED = 'NAMESPACED',
}

export enum SubjectKind {
  USER = 'USER',
  USER_GROUP = 'USER_GROUP',
  SERVICE_ACCOUNT = 'SERVICE_ACCOUNT',
}

export class Subject {
  @IsNotEmpty()
  kind: SubjectKind = SubjectKind.USER;
  @IsNotEmpty()
  id: string;
}

export class RoleRef {
  @IsNotEmpty()
  id: string;
}

export class CreateRoleBindingDto extends BaseEntityDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  kind: RoleBindingKind = RoleBindingKind.NAMESPACED;
  @IsOptional()
  namespace?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Subject)
  subjects: Subject[];
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RoleRef)
  roles: RoleRef[];
}

export class CreatedRoleBindingDto extends CreateRoleBindingDto
  implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRoleBindingDto extends PartialType(CreateRoleBindingDto) {}
