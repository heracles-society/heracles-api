import { Mongoose } from 'mongoose';
import { ComplaintSchema } from './schemas/complaint.schema';
import { COMPLAINTS_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const complaintProviders = [
  {
    provide: COMPLAINTS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Complaint', ComplaintSchema),
    inject: [DATABASE_CONNECTION],
  },
];
