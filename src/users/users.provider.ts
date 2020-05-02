import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { USER_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const userProviders = [
  {
    provide: USER_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
    inject: [DATABASE_CONNECTION],
  },
];
