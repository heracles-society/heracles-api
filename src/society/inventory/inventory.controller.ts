import { Controller, applyDecorators, UseGuards } from '@nestjs/common';
import {
  CreateInventoryDto,
  CreatedInventoryDto,
  UpdateInventoryDto,
} from './inventory.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Inventory } from './inventory.model';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { SocietyGuard } from '../society.guard';
import { JwtAuthGuard } from '../../auth/jwt.guard';

const BaseInventoryController = baseControllerFactory<Inventory>({
  name: 'inventories',
  routeDecorators: () =>
    applyDecorators(
      ApiParam({
        name: 'societyId',
        required: true,
        type: String,
      }),
      ApiBearerAuth(),
      UseGuards(JwtAuthGuard, SocietyGuard),
    ),
  entity: Inventory,
  createEntitySchema: CreateInventoryDto,
  patchEntitySchema: UpdateInventoryDto,
  createdEntitySchema: CreatedInventoryDto,
});

@ApiTags('inventories')
@Controller('societies/:societyId/inventories')
@UseGuards()
export class InventoryController extends BaseInventoryController {
  constructor(inventoryService: InventoryService) {
    super(inventoryService);
  }
}
