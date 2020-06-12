import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { PaginatedAPIMiddleware } from '../utils/pagination.decorators';
import { emergencyProvider } from './emergency.provider';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [EmergencyController],
  providers: [EmergencyService, ...emergencyProvider],
  exports: [EmergencyService],
})
export class EmergencyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginatedAPIMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: '/emergency',
    });
  }
}
