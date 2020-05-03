import { Mongoose } from 'mongoose';
import { SocietySchema } from './schemas/society.schema';
import { SOCIETY_MODEL, SOCIETY_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const societiesProviders = [
  {
    provide: SOCIETY_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(SOCIETY_MODEL, SocietySchema),
    inject: [DATABASE_CONNECTION],
  },
];
