import { Module } from '@nestjs/common';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyProvider } from './society.provider';
import { DatabaseModule } from '../database/database.module';
import { ReservationModule } from './reservation/reservation.module';
import { ComplaintModule } from './complaint/complaint.module';
import { EventModule } from './event/event.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    DatabaseModule,
    ReservationModule,
    ComplaintModule,
    EventModule,
    InventoryModule,
  ],
  controllers: [SocietyController],
  providers: [SocietyService, ...SocietyProvider.getProviders()],
})
export class SocietyModule {}
