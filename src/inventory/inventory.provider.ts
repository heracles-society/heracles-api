import { Mongoose } from 'mongoose';
import { InventorySchema } from './schemas/inventory.schema';
import { INVENTORY_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const inventoryProviders = [
  {
    provide: INVENTORY_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Inventory', InventorySchema),
    inject: [DATABASE_CONNECTION],
  },
];
