import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { DatabaseModule } from '../../database/database.module';
import { OrderProvider } from './order.provider';
import { OrderController } from './order.controller';
import { PaymentModule } from '../../payment/payment.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => PaymentModule)],
  providers: [OrderService, ...OrderProvider.getProviders()],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
