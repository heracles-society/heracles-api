import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

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
  kind: SubjectKind = SubjectKind.USER;
  id: string;
}

export class RoleRef {
  id: string;
}

export class CreateRoleBindingDto extends BaseEntityDto {
  name: string;
  kind: RoleBindingKind = RoleBindingKind.NAMESPACED;
  namespace?: string;
  subjects: Subject[];
  roles: RoleRef[];
}

export class CreatedRoleBindingDto extends CreateRoleBindingDto
  implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRoleBindingDto extends PartialType(CreateRoleBindingDto) {}
