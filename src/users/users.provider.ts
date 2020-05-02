import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { USER_MODEL, USER_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const userProviders = [
  {
    provide: USER_PROVIDER,
    useFactory: (mongoose: Mongoose) => mongoose.model(USER_MODEL, UserSchema),
    inject: [DATABASE_CONNECTION],
  },
];
