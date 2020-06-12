import { Module, forwardRef } from '@nestjs/common';
import { RoleBindingService } from './role-binding.service';
import { RoleBindingController } from './role-binding.controller';
import { DatabaseModule } from '../database/database.module';
import { RoleBindingProvider } from './role-binding.provider';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => RoleModule)],
  providers: [RoleBindingService, ...RoleBindingProvider.getProviders()],
  controllers: [RoleBindingController],
  exports: [RoleBindingService],
})
export class RoleBindingModule {}
