import { Controller, applyDecorators } from '@nestjs/common';
import {
  CreateInventoryDto,
  CreatedInventoryDto,
  UpdateInventoryDto,
} from './inventory.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Inventory } from './inventory.model';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';

const BaseInventoryController = baseControllerFactory<Inventory>({
  name: 'inventories',
  routeDecorators: () =>
    applyDecorators(
      ApiParam({
        name: 'societyId',
        required: true,
        type: String,
      }),
    ),
  entity: Inventory,
  createEntitySchema: CreateInventoryDto,
  patchEntitySchema: UpdateInventoryDto,
  createdEntitySchema: CreatedInventoryDto,
});

@ApiTags('inventories')
@Controller('societies/:societyId/inventories')
export class InventoryController extends BaseInventoryController {
  constructor(inventoryService: InventoryService) {
    super(inventoryService);
  }
}
