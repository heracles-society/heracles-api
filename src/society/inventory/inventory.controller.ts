import { Controller, SetMetadata } from '@nestjs/common';

import {
  CreateInventoryDto,
  CreatedInventoryDto,
  UpdateInventoryDto,
} from './inventory.dto';

import { ApiTags } from '@nestjs/swagger';

import { InventoryService } from './inventory.service';
import { INVENTORY_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { namespaceBaseControllerFactory } from '../../utils/namespace-module/namespace.base.controller';
import { Inventory } from './inventory.model';
const BaseSocietyNamespacedInventoryController = namespaceBaseControllerFactory<
  Inventory
>({
  modelName: INVENTORY_MODEL,
  createEntitySchema: CreateInventoryDto,
  createdEntitySchema: CreatedInventoryDto,
  patchEntitySchema: UpdateInventoryDto,
});
@ApiTags('inventories')
@Controller('societies/:societyId/inventories')
@SetMetadata('ResourceKind', INVENTORY_MODEL)
export class InventoryController extends BaseSocietyNamespacedInventoryController {
  constructor(
    inventoryService: InventoryService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(inventoryService, roleService, roleBindingService);
  }
}
