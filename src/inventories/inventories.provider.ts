import { Mongoose } from 'mongoose';
import { InventorySchema } from './schemas/inventory.schema';
import { INVENTORY_MODEL, INVENTORY_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const inventoryProviders = [
  {
    provide: INVENTORY_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(INVENTORY_MODEL, InventorySchema),
    inject: [DATABASE_CONNECTION],
  },
];
