import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { organizationsProviders } from './organizations.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, ...organizationsProviders],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
