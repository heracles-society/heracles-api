import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { EventProvider } from './event.provider';
import { EventController } from './event.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [EventService, ...EventProvider.getProviders()],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
