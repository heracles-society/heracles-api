import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { eventProviders } from './events.provider';

@Module({
  imports: [DatabaseModule, ReservationsModule, UsersModule],
  controllers: [EventsController],
  providers: [EventService, ...eventProviders],
  exports: [EventService],
})
export class EventsModule {}
