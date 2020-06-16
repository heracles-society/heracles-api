import {
  Controller,
  SetMetadata,
  Post,
  Req,
  Param,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';

import { CreateOrderDto, CreatedOrderDto, UpdateOrderDto } from './order.dto';

import {
  ApiTags,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { OrderService } from './order.service';
import { ORDER_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { Order } from './order.model';
import { namespaceBaseControllerFactory } from '../../utils/namespace-module/namespace.base.controller';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { NamespaceGuard } from '../../utils/namespace-module/namespace.guard';
import { Request } from 'express';

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

  @Post()
  @ApiCreatedResponse({
    description: 'The entity record has been successfully created.',
    type: CreatedOrderDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiBody({
    required: true,
    type: CreateOrderDto,
    description: 'Data for entity creation',
    isArray: false,
  })
  @SetMetadata('action', 'CREATE')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, NamespaceGuard)
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @ApiOperation({ operationId: `${ORDER_MODEL}__create` })
  async create(
    @Req() req: Request,
    @Param('societyId') societyId: string,
    @Body() entity: CreateOrderDto,
  ) {
    const createdOrder: Order = await super.create(req, societyId, entity);
    if (createdOrder) {
      return await this.baseService.createPayment(createdOrder.id);
    }
    throw new BadRequestException();
  }
}
