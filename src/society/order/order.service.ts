import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Order } from './order.model';
import { ORDER_PROVIDER } from './constants';
import { Model } from 'mongoose';
import { CreateOrderDto, OrderStatus } from './order.dto';
import { PaymentService } from '../../payment/payment.service';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @Inject(ORDER_PROVIDER) orderModel: Model<Order>,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {
    super(orderModel);
  }
  async create(entity: CreateOrderDto): Promise<Order> {
    const createdEntity = new this.baseModel({
      ...entity,
      status: OrderStatus.PENDING_PAYMENT_CREATION,
    });
    await createdEntity.save();
    return createdEntity;
  }

  async createPayment(orderId: string) {
    const order = await this.findById(orderId);
    const paymentInfo = await this.paymentService.create(
      order.amount,
      order.id,
    );
    return await this.patch(order.id, {
      status: OrderStatus.PENDING,
      metadata: {
        paymentInfo: paymentInfo,
      },
    });
  }
}
