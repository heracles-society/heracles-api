import { Controller, SetMetadata } from '@nestjs/common';

import { CreateOrderDto, CreatedOrderDto, UpdateOrderDto } from './order.dto';

import { ApiTags } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { ORDER_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { Order } from './order.model';
import { namespaceBaseControllerFactory } from '../../utils/namespace-module/namespace.base.controller';

const BaseSocietyNamespacedOrderController = namespaceBaseControllerFactory<
  Order
>({
  namespaceParam: 'societyId',
  namespaceKey: 'society',
  modelName: ORDER_MODEL,
  createEntitySchema: CreateOrderDto,
  createdEntitySchema: CreatedOrderDto,
  patchEntitySchema: UpdateOrderDto,
});

@ApiTags('orders')
@Controller('societies/:societyId/orders')
@SetMetadata('ResourceKind', ORDER_MODEL)
@SetMetadata('NamespaceKey', 'societyId')
export class OrderController extends BaseSocietyNamespacedOrderController {
  constructor(
    orderService: OrderService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(orderService, roleService, roleBindingService);
  }
}
