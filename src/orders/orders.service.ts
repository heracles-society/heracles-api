import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateOrdersDto } from './dto/orders.dto';
import { ORDERS_PROVIDER } from './constant';
import { Orders, OrderStatus } from './interface/orders.interface';
import { PaymentService } from './payment.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_PROVIDER) private readonly ordersModel: Model<Orders>,
    private readonly paymentService: PaymentService,
  ) {}
  private async createPayment(createOrderDto: CreateOrdersDto) {
    const orderDate = {
      amount: createOrderDto.Amount * 100,
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
    const paymentInfo = await this.createPayment(createOrderDto);
    const { Kind, Amount, Description, createdFor, createdBy } = createOrderDto;
    const newOrder = new this.ordersModel({
      Kind,
      Amount,
      Description,
      createdFor,
      createdBy,
      Status: OrderStatus.PENDING,
      metadata: {
        paymentInfo,
      },
    });
    return newOrder.save();
  }

  async findAll(query: Record<string, any>): Promise<Orders[]> {
    const data = await this.ordersModel.find(query).exec();

    return data;
  }
}
