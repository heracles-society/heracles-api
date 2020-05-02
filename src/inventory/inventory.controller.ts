import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, CreatedInventory } from './dto/inventory.dto';
import { Inventory } from './interface/inventory.interface';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatedInventory,
  })
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<Inventory> {
    try {
      const society = await this.inventoryService.create(createInventoryDto);
      if (society === null) {
        throw new BadRequestException();
      }
      return society;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ServiceUnavailableException();
    }
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedInventory],
  })
  async findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }
}
