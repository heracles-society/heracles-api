import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

export enum RoleKind {
  GLOBAL = 'GLOBAL',
  NAMESPACED = 'NAMESPACED',
}

export class Rule {
  resourceKind: string;
  resources: string[];
  actions: string[];
}

export class CreateRoleDto extends BaseEntityDto {
  name: string;
  kind: RoleKind = RoleKind.NAMESPACED;
  namespace?: string;
  rules: Rule[];
}

export class CreatedRoleDto extends CreateRoleDto implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
