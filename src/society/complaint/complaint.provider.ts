import { Schema, Types, Mongoose } from 'mongoose';
import { USER_MODEL } from '../../user/constants';
import { COMPLAINT_PROVIDER, COMPLAINT_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../../database/constants';
import { SOCIETY_MODEL } from '../constants';

const ComplaintSchema = new Schema(
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

export class ComplaintProvider {
  static getProviders() {
    return [
      {
        provide: COMPLAINT_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(COMPLAINT_MODEL, ComplaintSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
