import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SocietiesController } from './societies.controller';
import { SocietyService } from './societies.service';

import { societiesProviders } from './societies.provider';
import { DatabaseModule } from '../database/database.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UtilsModule } from '../utils/utils.module';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';

@Module({
  imports: [DatabaseModule, OrganizationsModule, UtilsModule],
  controllers: [SocietiesController],
  providers: [SocietyService, ...societiesProviders],
  exports: [SocietyService],
})
export class SocietiesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/societies',
    });
  }
}
