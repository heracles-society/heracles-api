import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UserModule } from '../../user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { InventoryProvider } from './inventory.provider';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [InventoryService, ...InventoryProvider.getProviders()],
  exports: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
