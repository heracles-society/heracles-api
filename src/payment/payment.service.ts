import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderService } from '../society/order/order.service';
import { TRANSACTION_SUCCESS, TRANSACTION_FAILURE } from './constants';
import { OrderStatus } from '../society/order/order.dto';

import * as crypto from 'crypto';
import * as Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  public client: any;
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {
    this.client = new Razorpay({
      // eslint-disable-next-line @typescript-eslint/camelcase
      key_id: configService.get('RAZORPAY_KEY_ID'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      key_secret: configService.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async create(amount: number, receipt = 'receipt', notes: any = {}) {
    return this.client.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt,
      notes,
      // eslint-disable-next-line @typescript-eslint/camelcase
      payment_capture: 1,
    });
  }

  async update(paymentData: any) {
    const { status, order_id: paymentId } = paymentData.payment.entity;
    const orderRecord = await this.orderService.findOne({
      $and: [{ 'metadata.paymentInfo.id': paymentId }],
    });

    if (orderRecord) {
      const updateData = {
        'metadata.paymentUpdates': { $push: paymentData },
      };
      switch (status) {
        case TRANSACTION_SUCCESS:
          updateData['status'] = OrderStatus.COMPLETED;
          break;
        case TRANSACTION_FAILURE:
          updateData['status'] = OrderStatus.FAILED;
          break;
        default:
          break;
      }
      return await this.orderService.update(orderRecord.id, updateData);
    }
    return null;
  }

  /**
   * @name isValidSignature
   * @param body { Object } request body object
   * @param signature { String } razorpay signature from req headers
   * @returns { Boolean } return true or false if signature is valid
   */
  isValidSignature(body: any, signature: string): boolean {
    const paymentSecret: string = this.configService.get(
      'RAZORPAY_PAYMENT_SECRET',
    );
    const expectedSignature: string = crypto
      .createHmac('sha256', paymentSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    return expectedSignature === signature;
  }
}
