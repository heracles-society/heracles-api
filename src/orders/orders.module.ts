import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';
import { orderProviders } from './orders.provider';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';

@Module({
  imports: [DatabaseModule, UtilsModule, ConfigModule],
  controllers: [OrdersController],
  providers: [OrdersService, ...orderProviders, PaymentService],
  exports: [OrdersService],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/orders',
    });
  }
}
