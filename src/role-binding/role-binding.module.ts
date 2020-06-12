import { Module, Global } from '@nestjs/common';
import { RoleBindingService } from './role-binding.service';
import { RoleBindingController } from './role-binding.controller';
import { DatabaseModule } from '../database/database.module';
import { RoleBindingProvider } from './role-binding.provider';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [RoleBindingService, ...RoleBindingProvider.getProviders()],
  controllers: [RoleBindingController],
  exports: [RoleBindingService],
})
export class RoleBindingModule {}
