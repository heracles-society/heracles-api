import { Injectable, Inject } from '@nestjs/common';
import { INVENTORY_MODEL } from './constants';
import { Model } from 'mongoose';
import { Inventory } from './interface/inventory.interface';
import { CreateInventoryDto } from './dto/inventory.dto';
import { SocietiesService } from '../societies/societies.service';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(INVENTORY_MODEL) private readonly inventoryModel: Model<Inventory>,
    private readonly societyService: SocietiesService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const { society, ...restProps } = createInventoryDto;
    const societyRecord = await this.societyService.findOne({
      name: society,
    });
    if (societyRecord) {
      const createdInventory = new this.inventoryModel({
        ...restProps,
        society: societyRecord.id,
      });
      return createdInventory.save();
    }
    return null;
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }
}
