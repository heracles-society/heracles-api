import { Mongoose } from 'mongoose';
import { EventSchema } from './schemas/event.schema';
import { EVENT_MODEL, EVENT_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const eventProviders = [
  {
    provide: EVENT_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(EVENT_MODEL, EventSchema),
    inject: [DATABASE_CONNECTION],
  },
];
