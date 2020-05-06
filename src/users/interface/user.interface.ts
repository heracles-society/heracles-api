import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  roles: string[];
  familyName?: string;
  givenName?: string;
  picture?: string;
  openId?: string;
}
