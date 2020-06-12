import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { ReservationProvider } from './reservation.provider';
import { ReservationController } from './reservation.controller';
import { RoleBindingModule } from '../../role-binding/role-binding.module';

@Module({
  imports: [UserModule, DatabaseModule, RoleBindingModule],
  providers: [ReservationService, ...ReservationProvider.getProviders()],
  exports: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
