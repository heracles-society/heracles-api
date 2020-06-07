import { Module } from '@nestjs/common';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyProvider } from './society.provider';
import { DatabaseModule } from '../database/database.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [DatabaseModule, ReservationModule],
  controllers: [SocietyController],
  providers: [SocietyService, ...SocietyProvider.getProviders()],
})
export class SocietyModule {}
