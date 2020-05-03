import { Module } from '@nestjs/common';
import { SocietiesController } from './societies.controller';
import { SocietyService } from './societies.service';

import { societiesProviders } from './societies.provider';
import { DatabaseModule } from '../database/database.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [DatabaseModule, OrganizationsModule],
  controllers: [SocietiesController],
  providers: [SocietyService, ...societiesProviders],
  exports: [SocietyService],
})
export class SocietiesModule {}
