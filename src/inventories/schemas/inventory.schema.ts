import { Schema } from 'mongoose';
import { SOCIETY_MODEL } from '../../societies/constants';
import { USER_MODEL } from '../../users/constants';

export const InventorySchema = new Schema(
  {
    name: String,
    kind: String,
    status: String,
    society: { type: Schema.Types.ObjectId, ref: SOCIETY_MODEL },
    owner: { type: Schema.Types.ObjectId, ref: USER_MODEL },
    manager: { type: Schema.Types.ObjectId, ref: USER_MODEL },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
