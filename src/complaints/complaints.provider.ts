import { Mongoose } from 'mongoose';
import { ComplaintSchema } from './schemas/complaint.schema';
import { COMPLAINT_MODEL, COMPLAINT_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const complaintProviders = [
  {
    provide: COMPLAINT_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(COMPLAINT_MODEL, ComplaintSchema),
    inject: [DATABASE_CONNECTION],
  },
];
