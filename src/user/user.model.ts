import { BaseModel } from '../utils/base-module/base.model';

export interface User extends BaseModel {
  name: string;
  email: string;
  roles: string[];
  familyName?: string;
  givenName?: string;
  picture?: string;
  openId?: string;
}
