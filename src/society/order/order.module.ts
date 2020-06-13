import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { OrderProvider } from './order.provider';
import { OrderController } from './order.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [OrderService, ...OrderProvider.getProviders()],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
