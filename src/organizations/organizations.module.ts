import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationService } from './organizations.service';
import { organizationsProviders } from './organizations.provider';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [OrganizationsController],
  providers: [OrganizationService, ...organizationsProviders],
  exports: [OrganizationService],
})
export class OrganizationsModule {}
