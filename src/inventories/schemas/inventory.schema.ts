import { Schema } from 'mongoose';
import { SOCIETY_MODEL } from '../../societies/constants';
import { USER_MODEL } from '../../users/constants';

export const InventorySchema = new Schema(
  {
    name: String,
    kind: String,
    status: String,
    society: { type: Schema.Types.ObjectId, ref: SOCIETY_MODEL },
    owners: [{ type: Schema.Types.ObjectId, ref: USER_MODEL }],
    managers: [{ type: Schema.Types.ObjectId, ref: USER_MODEL }],
    details: { type: Object, default: {} },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
