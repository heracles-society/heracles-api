import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationService } from './organizations.service';
import { organizationsProviders } from './organizations.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OrganizationsController],
  providers: [OrganizationService, ...organizationsProviders],
  exports: [OrganizationService],
})
export class OrganizationsModule {}
