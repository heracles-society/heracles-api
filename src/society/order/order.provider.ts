import { Schema, Types, Mongoose } from 'mongoose';
import { USER_MODEL } from '../../user/constants';
import { ORDER_PROVIDER, ORDER_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../../database/constants';
import { SOCIETY_MODEL } from '../constants';

const OrderSchema = new Schema(
  {
    amount: Number,
    description: String,
    status: String,
    society: {
      type: Types.ObjectId,
      ref: SOCIETY_MODEL,
    },
    createdFor: {
      type: Types.ObjectId,
      ref: USER_MODEL,
    },
    createdBy: { type: Types.ObjectId, ref: USER_MODEL },
    metadata: Object,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class OrderProvider {
  static getProviders() {
    return [
      {
        provide: ORDER_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(ORDER_MODEL, OrderSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
