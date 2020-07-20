import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { DatabaseModule } from '../../database/database.module';
import { ReservationProvider } from './reservation.provider';
import { ReservationController } from './reservation.controller';
import { RoleBindingModule } from '../../role-binding/role-binding.module';

@Module({
  imports: [DatabaseModule, RoleBindingModule],
  providers: [ReservationService, ...ReservationProvider.getProviders()],
  exports: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
