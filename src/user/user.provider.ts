import * as mongoose from 'mongoose';
import { USER_PROVIDER, USER_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    roles: [String],
    familyName: String,
    givenName: String,
    picture: String,
    openId: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class UserProvider {
  static getProviders() {
    return [
      {
        provide: USER_PROVIDER,
        useFactory: (mongoose: mongoose.Mongoose) =>
          mongoose.model(USER_MODEL, UserSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
