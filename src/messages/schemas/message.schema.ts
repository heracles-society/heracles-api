import { Schema } from 'mongoose';
import { USER_MODEL } from '../../users/constants';

export const InventorySchema = new Schema(
  {
    name: String,
    kind: String,
    status: String,
    from: { type: Schema.Types.ObjectId, ref: USER_MODEL },
    to: { type: Schema.Types.ObjectId, ref: USER_MODEL },
    message: String,
    deliveries: {
      recipient: { type: Schema.Types.ObjectId, ref: USER_MODEL },
      deliveredAt: Date,
      readAt: Date,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
