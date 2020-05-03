import { Mongoose } from 'mongoose';
import { ReservationSchema } from './schemas/reservation.schema';
import { RESERVATION_MODEL, RESERVATION_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const reservationProviders = [
  {
    provide: RESERVATION_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(RESERVATION_MODEL, ReservationSchema),
    inject: [DATABASE_CONNECTION],
  },
];
