import { Schema } from 'mongoose';

export const InventorySchema = new Schema(
  {
    name: String,
    type: String,
    status: String,
    society: { type: Schema.Types.ObjectId, ref: 'Society' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    leaseInfo: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
