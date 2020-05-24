import * as mongoose from 'mongoose';
import { RESERVATION_MODEL } from '../../reservations/constants';

export const EventSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RESERVATION_MODEL,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
