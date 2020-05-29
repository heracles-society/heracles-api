import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { eventProviders } from './events.provider';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';
import { SocietiesModule } from '../societies/societies.module';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => SocietiesModule),
  ],
  controllers: [EventsController],
  providers: [EventService, ...eventProviders],
  exports: [EventService],
})
export class EventsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/events',
    });
  }
}
