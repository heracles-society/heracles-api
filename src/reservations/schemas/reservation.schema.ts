import { Schema, Types } from 'mongoose';
import { INVENTORY_MODEL } from '../../inventories/constants';
import { USER_MODEL } from '../../users/constants';

export const ReservationSchema = new Schema(
  {
    inventory: { type: Types.ObjectId, ref: INVENTORY_MODEL },
    fromDate: Date,
    toDate: Date,
    reservedBy: { type: Types.ObjectId, ref: USER_MODEL },
    status: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
