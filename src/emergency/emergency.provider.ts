import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/constants';
import { EMERGENCY_MODEL, EMERGENCY_PROVIDER } from './constant';
import { EmergencySchema } from './schemas/emergency.schema';

export const emergencyProvider = [
  {
    provide: EMERGENCY_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(EMERGENCY_MODEL, EmergencySchema),
    inject: [DATABASE_CONNECTION],
  },
];
