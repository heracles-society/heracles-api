import {
  Controller,
  Post,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post('razorpay/callback')
  @ApiExcludeEndpoint()
  @ApiOkResponse()
  async updatePaymentStatus(@Req() req: Request): Promise<any> {
    const { order_id: paymentId } = req.body.payload.payment.entity;

    if (!paymentId) {
      throw new NotFoundException();
    }

    if (
      this.paymentService.isValidSignature(
        req.body,
        req.headers['x-razorpay-signature'].toString(),
      )
    ) {
      const updatedRecord = this.paymentService.update(req.body);
      if (updatedRecord) {
        req.res.status(200);
        req.res.send();
      } else {
        throw new NotFoundException();
      }
    }

    throw new UnauthorizedException();
  }
}
