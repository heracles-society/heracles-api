import { Injectable, Inject } from '@nestjs/common';
import { INVENTORY_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { Inventory } from './interface/inventory.interface';
import { CreateInventoryDto } from './dto/inventory.dto';
import { SocietyService } from '../societies/societies.service';
import { UserService } from '../users/users.service';
import { isArray } from 'util';

interface PaginatedInventory {
  data: Inventory[];
  total: number;
  cursor: Date;
}

@Injectable()
export class InventoryService {
  constructor(
    @Inject(INVENTORY_PROVIDER)
    private readonly inventoryModel: Model<Inventory>,
    private readonly societyService: SocietyService,
    private readonly userService: UserService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const { society, owners, managers, ...restProps } = createInventoryDto;

    const ownerRecords = [];
    const managerRecords = [];

    const societyRecord = await this.societyService.findOne({
      _id: new Types.ObjectId(society),
    });

    owners.map(async owner => {
      const ownerRecord = await this.userService.findOne({
        _id: new Types.ObjectId(owner),
      });
      ownerRecords.push(ownerRecord);
    });
    managers.map(async manager => {
      const managerRecord = await this.userService.findOne({
        _id: new Types.ObjectId(manager),
      });
      managerRecords.push(managerRecord);
    });

    const hasMissingOwners = owners.some(owner => owner === null);
    const hasMissingManagers = managers.some(manager => manager === null);

    if (hasMissingManagers || hasMissingOwners) {
      return null;
    }

    if (owners.length === 0) {
      return null;
    }

    const createdInventory = new this.inventoryModel({
      ...restProps,
      society: societyRecord.id,
      owners: ownerRecords.map(owner => owner.id),
      managers: managerRecords.map(manager => manager.id),
    });

    return createdInventory.save();
  }

  async findOne(params): Promise<Inventory> {
    return this.inventoryModel.findOne(params).exec();
  }

  async findAll(
    query: object,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedInventory> {
    const { skip, limit, cursor } = options;
    let updatedQuery = {};
    if (cursor) {
      if (isArray(query['$and'])) {
        updatedQuery['$and'] = [
          { createdAt: { $gt: cursor } },
          ...query['$and'],
        ];
      } else {
        updatedQuery['$and'] = [{ createdAt: { $gt: cursor } }, query];
      }
    } else {
      updatedQuery = query;
    }

    const data = await this.inventoryModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.inventoryModel.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }
}
