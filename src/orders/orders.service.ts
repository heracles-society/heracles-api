import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateOrdersDto } from './dto/orders.dto';
import { ORDERS_PROVIDER } from './constant';
import { Orders, OrderStatus } from './interface/orders.interface';
import { PaymentService } from './payment.service';
import { isArray } from 'util';

interface PaginatedUser {
  data: Orders[];
  total: number;
  cursor: Date;
}
@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_PROVIDER) private readonly ordersModel: Model<Orders>,
    private readonly paymentService: PaymentService,
  ) {}
  private async createPayment(createOrderDto: CreateOrdersDto) {
    const orderDate = {
      amount: createOrderDto.amount * 100,
      currency: 'INR',
      receipt: 'receipt',
      // eslint-disable-next-line @typescript-eslint/camelcase
      payment_capture: 1,
    };
    return new Promise((resolve, reject) => {
      this.paymentService.client.orders.create(
        orderDate,
        async (err, order) => {
          if (err) {
            reject(err);
          } else {
            resolve(order);
          }
        },
      );
    });
  }
  async create(createOrderDto: CreateOrdersDto): Promise<Orders> {
    const paymentInfo: any = await this.createPayment(createOrderDto);
    const { kind, amount, description, createdFor, createdBy } = createOrderDto;
    const newOrder = new this.ordersModel({
      kind,
      amount,
      description,
      createdFor,
      createdBy,
      status: OrderStatus.PENDING,
      metadata: {
        paymentInfo,
      },
    });
    return newOrder.save();
  }

  async findAll(
    query: Record<string, any>,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedUser> {
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
    const data = await this.ordersModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.ordersModel.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }

  async findOneAndUpdate(filter: any, update: any): Promise<Orders> {
    return this.ordersModel
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .exec();
  }
}
