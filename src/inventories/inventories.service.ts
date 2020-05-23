import { Injectable, Inject } from '@nestjs/common';
import { INVENTORY_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { Inventory } from './interface/inventory.interface';
import { CreateInventoryDto } from './dto/inventory.dto';
import { SocietyService } from '../societies/societies.service';
import { UserService } from '../users/users.service';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(INVENTORY_PROVIDER)
    private readonly inventoryModel: Model<Inventory>,
    private readonly societyService: SocietyService,
    private readonly userService: UserService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const { society, owner, manager, ...restProps } = createInventoryDto;
    const societyRecord = await this.societyService.findOne({
      _id: new Types.ObjectId(society),
    });
    const ownerRecord = await this.userService.findOne({
      _id: new Types.ObjectId(owner),
    });
    let managerRecord = null;
    if (manager) {
      managerRecord = await this.userService.findOne({
        _id: new Types.ObjectId(manager),
      });
    }
    if (societyRecord && owner && (manager ? managerRecord : true)) {
      const createdInventory = new this.inventoryModel({
        ...restProps,
        society: societyRecord.id,
        owner: ownerRecord.id,
        manager: manager ? managerRecord.id : null,
      });
      return createdInventory.save();
    }
    return null;
  }

  async findOne(params): Promise<Inventory> {
    return this.inventoryModel.findOne(params).exec();
  }

  async findAll(query: object): Promise<Inventory[]> {
    return this.inventoryModel.find(query).exec();
  }
}
