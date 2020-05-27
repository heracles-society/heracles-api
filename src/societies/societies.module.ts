import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { SocietiesController } from './societies.controller';
import { SocietyService } from './societies.service';

import { societiesProviders } from './societies.provider';
import { DatabaseModule } from '../database/database.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';
import { InventoriesModule } from '../inventories/inventories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationsModule,
    UtilsModule,
    forwardRef(() => InventoriesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [SocietiesController],
  providers: [SocietyService, ...societiesProviders],
  exports: [SocietyService],
})
export class SocietiesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes(
      {
        method: RequestMethod.GET,
        path: '/societies',
      },
      {
        method: RequestMethod.GET,
        path: '/societies/:id/apartments',
      },
    );
  }
}
