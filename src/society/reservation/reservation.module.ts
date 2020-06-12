import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { ReservationProvider } from './reservation.provider';
import { ReservationController } from './reservation.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [ReservationService, ...ReservationProvider.getProviders()],
  exports: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
