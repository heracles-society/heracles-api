import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  public client;
  constructor(private readonly configService: ConfigService) {
    this.client = new Razorpay({
      // eslint-disable-next-line @typescript-eslint/camelcase
      key_id: configService.get('RAZOR_PAY_KEY_ID'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      key_secret: configService.get('RAZOR_PAY_KEY_SECRET'),
    });
  }
}
