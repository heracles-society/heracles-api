import * as mongoose from 'mongoose';
import { USER_MODEL } from '../../users/constants';

export const OrdersSchema = new mongoose.Schema(
  {
    razorpayid: String,
    kind: String,
    amount: Number,
    description: String,
    status: String,
    createdFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_MODEL,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL },
    metadata: Object,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
