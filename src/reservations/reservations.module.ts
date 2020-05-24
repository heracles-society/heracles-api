import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { DatabaseModule } from '../database/database.module';
import { InventoriesModule } from '../inventories/inventories.module';
import { UsersModule } from '../users/users.module';
import { reservationProviders } from './reservations.provider';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, InventoriesModule, UsersModule, UtilsModule],
  controllers: [ReservationsController],
  providers: [ReservationService, ...reservationProviders],
  exports: [ReservationService],
})
export class ReservationsModule {}
