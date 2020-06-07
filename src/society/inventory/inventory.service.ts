import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Inventory } from './inventory.model';
import { INVENTORY_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class InventoryService extends BaseService<Inventory> {
  constructor(@Inject(INVENTORY_PROVIDER) inventoryModel: Model<Inventory>) {
    super(inventoryModel);
  }
}
