import { Schema, Types, Mongoose } from 'mongoose';
import { USER_MODEL } from '../../user/constants';
import { APPLICATION_PROVIDER, APPLICATION_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../../database/constants';
import { SOCIETY_MODEL } from '../constants';

const ApplicationSchema = new Schema(
  {
    kind: String,
    status: String,
    description: String,
    priority: String,
    society: { type: Types.ObjectId, ref: SOCIETY_MODEL },
    raisedBy: { type: Types.ObjectId, ref: USER_MODEL },
    assignedTo: { type: Types.ObjectId, ref: USER_MODEL },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class ApplicationProvider {
  static getProviders() {
    return [
      {
        provide: APPLICATION_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(APPLICATION_MODEL, ApplicationSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
