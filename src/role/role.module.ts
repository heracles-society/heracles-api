import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DatabaseModule } from '../database/database.module';
import { RoleProvider } from './role.provider';

@Module({
  imports: [DatabaseModule],
  providers: [RoleService, ...RoleProvider.getProviders()],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
