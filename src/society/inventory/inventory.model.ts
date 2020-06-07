import { BaseModel } from '../../utils/base-module/base.model';
import { InventoryType } from './inventory.dto';

export class Inventory extends BaseModel {
  name: string;
  kind: InventoryType;
  society: string;
  owners: string[];
  managers: string[];
}
