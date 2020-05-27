import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessagesController } from './messages.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { messageProviders } from './messages.provider';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';

@Module({
  imports: [DatabaseModule, UsersModule, UtilsModule],
  providers: [MessageService, ...messageProviders],
  controllers: [MessagesController],
  exports: [MessageService],
})
export class MessagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/messages',
    });
  }
}
