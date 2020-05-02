import { Mongoose } from 'mongoose';
import { SocietySchema } from './schemas/society.schema';
import { SOCIETY_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const societiesProviders = [
  {
    provide: SOCIETY_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Society', SocietySchema),
    inject: [DATABASE_CONNECTION],
  },
];
