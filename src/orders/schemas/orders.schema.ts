import * as mongoose from 'mongoose';
import { USER_MODEL } from '../../users/constants';

export const OrdersSchema = new mongoose.Schema(
  {
    Razorpayid: String,
    Kind: String,
    Amount: Number,
    Description: String,
    Status: String,
    createdFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_MODEL,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL },
    metadata: Object,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
