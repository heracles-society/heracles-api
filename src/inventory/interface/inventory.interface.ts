import { Document } from 'mongoose';
import { InventoryType } from '../dto/inventory.dto';

export interface Inventory extends Document {
  name: string;
  type: InventoryType;
  society: string;
}
