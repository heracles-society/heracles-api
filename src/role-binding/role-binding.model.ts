import { BaseModel } from '../utils/base-module/base.model';
import { RoleBindingKind, Subject, RoleRef } from './role-binding.dto';

export class RoleBinding extends BaseModel {
  name: string;
  kind: RoleBindingKind = RoleBindingKind.NAMESPACED;
  namespace?: string;
  subjects: Subject[];
  roles: RoleRef[];
}
