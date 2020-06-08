import { Schema, Types, Mongoose } from 'mongoose';
import { USER_MODEL } from '../../user/constants';
import { EVENT_PROVIDER, EVENT_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../../database/constants';
import { SOCIETY_MODEL } from '../constants';

const EventSchema = new Schema(
  {
    name: String,
    kind: String,
    description: String,
    society: { type: Types.ObjectId, ref: SOCIETY_MODEL },
    createdBy: { type: Types.ObjectId, ref: USER_MODEL },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class EventProvider {
  static getProviders() {
    return [
      {
        provide: EVENT_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(EVENT_MODEL, EventSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
