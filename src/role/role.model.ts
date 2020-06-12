import { BaseModel } from '../utils/base-module/base.model';
import { RoleKind, Rule } from './role.dto';

export class Role extends BaseModel {
  name: string;
  kind: RoleKind = RoleKind.GLOBAL;
  namespace?: string;
  rules: Rule[];
}
