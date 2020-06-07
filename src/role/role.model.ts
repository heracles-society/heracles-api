import { BaseModel } from '../utils/base-module/base.model';
import { RoleKind, Rule } from './role.dto';

export class Role extends BaseModel {
  name: string;
  kind: RoleKind = RoleKind.NAMESPACED;
  namespace?: string;
  rules: Rule[];
}
