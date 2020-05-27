import { Mongoose } from 'mongoose';
import { InventorySchema } from './schemas/message.schema';
import { MESSAGE_MODEL, MESSAGE_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const messageProviders = [
  {
    provide: MESSAGE_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(MESSAGE_MODEL, InventorySchema),
    inject: [DATABASE_CONNECTION],
  },
];
