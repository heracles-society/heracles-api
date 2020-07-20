import { BaseModel } from '../utils/base-module/base.model';

export class User extends BaseModel {
  name: string;
  email: string;
  roles: string[];
  familyName?: string;
  givenName?: string;
  picture?: string;
  openId?: string;
  mobile?: string;
}
