import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { userProviders } from './users.provider';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [UsersController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/users',
    });
  }
}
