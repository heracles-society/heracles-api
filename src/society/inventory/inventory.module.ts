import { Module, forwardRef } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { InventoryProvider } from './inventory.provider';
import { InventoryController } from './inventory.controller';
import { SocietyModule } from '../society.module';
import { RoleBindingModule } from '../../role-binding/role-binding.module';
import { RoleModule } from '../../role/role.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    forwardRef(() => SocietyModule),
    RoleModule,
    RoleBindingModule,
  ],
  providers: [InventoryService, ...InventoryProvider.getProviders()],
  exports: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
