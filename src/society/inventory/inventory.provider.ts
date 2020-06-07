import { Schema, Types, Mongoose } from 'mongoose';
import { USER_MODEL } from '../../user/constants';
import { INVENTORY_PROVIDER, INVENTORY_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../../database/constants';
import { SOCIETY_MODEL } from '../constants';

const InventorySchema = new Schema(
  {
    name: String,
    kind: String,
    status: String,
    society: { type: Types.ObjectId, ref: SOCIETY_MODEL },
    owners: [{ type: Types.ObjectId, ref: USER_MODEL }],
    managers: [{ type: Types.ObjectId, ref: USER_MODEL }],
    metadata: { type: Object, default: {} },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class InventoryProvider {
  static getProviders() {
    return [
      {
        provide: INVENTORY_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(INVENTORY_MODEL, InventorySchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
