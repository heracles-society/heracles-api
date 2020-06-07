import { Schema, Types, Mongoose } from 'mongoose';
import { USER_MODEL } from '../../user/constants';
import { RESERVATION_PROVIDER, RESERVATION_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../../database/constants';

const ReservationSchema = new Schema(
  {
    kind: String,
    fromDate: Date,
    toDate: Date,
    reservedBy: { type: Types.ObjectId, ref: USER_MODEL },
    status: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class ReservationProvider {
  static getProviders() {
    return [
      {
        provide: RESERVATION_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(RESERVATION_MODEL, ReservationSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
