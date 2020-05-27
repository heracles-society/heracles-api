import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { userProviders } from './users.provider';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';
// import { SocietiesModule } from '../societies/societies.module';
import { InventoriesModule } from '../inventories/inventories.module';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    // forwardRef(() => SocietiesModule),
    forwardRef(() => InventoriesModule),
  ],
  controllers: [UsersController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes(
      {
        method: RequestMethod.GET,
        path: '/users',
      },
      {
        method: RequestMethod.GET,
        path: '/users/me/inventories',
      },
    );
  }
}
