import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Order } from './order.model';
import { ORDER_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(@Inject(ORDER_PROVIDER) orderModel: Model<Order>) {
    super(orderModel);
  }
}
