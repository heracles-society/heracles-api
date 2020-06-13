import { Module, forwardRef } from '@nestjs/common';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyProvider } from './society.provider';
import { DatabaseModule } from '../database/database.module';
import { ReservationModule } from './reservation/reservation.module';
import { ComplaintModule } from './complaint/complaint.module';
import { EventModule } from './event/event.module';
import { InventoryModule } from './inventory/inventory.module';
import { ApplicationModule } from './application/application.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ReservationModule),
    forwardRef(() => ComplaintModule),
    forwardRef(() => EventModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => ApplicationModule),
    OrderModule,
  ],
  controllers: [SocietyController],
  providers: [SocietyService, ...SocietyProvider.getProviders()],
  exports: [SocietyService],
})
export class SocietyModule {}
