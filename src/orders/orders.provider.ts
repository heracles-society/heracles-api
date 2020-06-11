import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/constants';
import { ORDERS_PROVIDER, ORDERS_MODEL } from './constant';
import { OrdersSchema } from './schemas/orders.schema';

export const orderProviders = [
  {
    provide: ORDERS_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(ORDERS_MODEL, OrdersSchema),
    inject: [DATABASE_CONNECTION],
  },
];
