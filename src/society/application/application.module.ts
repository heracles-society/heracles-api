import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { ApplicationProvider } from './application.provider';
import { ApplicationController } from './application.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [ApplicationService, ...ApplicationProvider.getProviders()],
  exports: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
