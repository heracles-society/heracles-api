import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { inventoryProviders } from './inventory.provider';
import { DatabaseModule } from '../database/database.module';
import { SocietiesModule } from '../societies/societies.module';

@Module({
  imports: [DatabaseModule, SocietiesModule],
  controllers: [InventoryController],
  providers: [InventoryService, ...inventoryProviders],
})
export class InventoryModule {}
