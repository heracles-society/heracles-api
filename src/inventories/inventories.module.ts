import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoryService } from './inventories.service';
import { inventoryProviders } from './inventories.provider';
import { DatabaseModule } from '../database/database.module';
import { SocietiesModule } from '../societies/societies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, SocietiesModule, UsersModule],
  controllers: [InventoriesController],
  providers: [InventoryService, ...inventoryProviders],
  exports: [InventoryService],
})
export class InventoriesModule {}
