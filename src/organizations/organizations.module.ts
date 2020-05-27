import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationService } from './organizations.service';
import { organizationsProviders } from './organizations.provider';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UtilsModule, forwardRef(() => UsersModule)],
  controllers: [OrganizationsController],
  providers: [OrganizationService, ...organizationsProviders],
  exports: [OrganizationService],
})
export class OrganizationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/organizations',
    });
  }
}
