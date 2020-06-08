/* eslint-disable @typescript-eslint/camelcase */
import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Get,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateOrdersDto, CreatedOrderDto } from './dto/orders.dto';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { Orders, OrderStatus } from './interface/orders.interface';
import { UtilService } from '../utils/utils.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { TRANSACTION_SUCCESS, TRANSACTION_FAILURE } from './constant';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private orderService: OrdersService,
    private utilService: UtilService,
    private configService: ConfigService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: CreateOrdersDto })
  async create(
    @Body() createOrderDto: CreateOrdersDto,
  ): Promise<CreatedOrderDto> {
    const { kind, amount, description, createdFor, createdBy } = createOrderDto;
    const newOrder = await this.orderService.create({
      kind,
      amount,
      description,
      createdFor,
      createdBy,
    });
    if (newOrder) {
      return newOrder;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CreateOrdersDto })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Orders[]> {
    const queryString: string = query.q;
    const { skip, limit, cursor } = query;
    let params = {};
    if (queryString) {
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );
      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      params = finalDBQuery;
    }
    const {
      total,
      data,
      cursor: newCursor,
    } = await this.orderService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }

  @Post('payment')
  @ApiExcludeEndpoint()
  @ApiOkResponse()
  async updatePaymentStatus(@Req() req): Promise<any> {
    const { status, order_id } = req.body.payload.payment.entity;

    if (!order_id) {
      throw new NotFoundException();
    }

    if (this.isValidSignature(req.body, req.headers['x-razorpay-signature'])) {
      let orderRecord;
      // Check if transaction is success, then update the status to COMPLETE in orders table else update to FAILED
      if (status === TRANSACTION_SUCCESS) {
        orderRecord = await this.orderService.findOneAndUpdate(
          {
            'metadata.paymentInfo.id': order_id,
          },
          { status: OrderStatus.COMPLETED },
        );
      } else if (status === TRANSACTION_FAILURE) {
        orderRecord = await this.orderService.findOneAndUpdate(
          {
            'metadata.paymentInfo.id': order_id,
          },
          { status: OrderStatus.FAILED },
        );
      }
      if (orderRecord) {
        return orderRecord;
      } else {
        throw new NotFoundException();
      }
    }
  }

  /**
   * @name isValidSignature
   * @param body { Object } request body object
   * @param signature { String } razorpay signature from req headers
   * @returns { Boolean } return true or false if signature is valid
   */
  private isValidSignature(body: any, signature: string): boolean {
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
