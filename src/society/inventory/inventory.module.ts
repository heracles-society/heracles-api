import { Module, forwardRef } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { InventoryProvider } from './inventory.provider';
import { InventoryController } from './inventory.controller';
import { SocietyModule } from '../society.module';

@Module({
  imports: [UserModule, DatabaseModule, forwardRef(() => SocietyModule)],
  providers: [InventoryService, ...InventoryProvider.getProviders()],
  exports: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
