import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { DatabaseModule } from '../../database/database.module';
import { EventProvider } from './event.provider';
import { EventController } from './event.controller';
import { RoleBindingModule } from '../../role-binding/role-binding.module';

@Module({
  imports: [DatabaseModule, RoleBindingModule],
  providers: [EventService, ...EventProvider.getProviders()],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
