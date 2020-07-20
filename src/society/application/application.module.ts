import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { DatabaseModule } from '../../database/database.module';
import { ApplicationProvider } from './application.provider';
import { ApplicationController } from './application.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ApplicationService, ...ApplicationProvider.getProviders()],
  exports: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
