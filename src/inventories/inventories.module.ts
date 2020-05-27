import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoryService } from './inventories.service';
import { inventoryProviders } from './inventories.provider';
import { DatabaseModule } from '../database/database.module';
import { SocietiesModule } from '../societies/societies.module';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => SocietiesModule),
    forwardRef(() => UsersModule),
    UtilsModule,
  ],
  controllers: [InventoriesController],
  providers: [InventoryService, ...inventoryProviders],
  exports: [InventoryService],
})
export class InventoriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/inventories',
    });
  }
}
