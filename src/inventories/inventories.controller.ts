import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  ServiceUnavailableException,
  Param,
} from '@nestjs/common';
import { InventoryService } from './inventories.service';
import { CreateInventoryDto, CreatedInventory } from './dto/inventory.dto';
import { Inventory } from './interface/inventory.interface';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('inventories')
@Controller('inventories')
export class InventoriesController {
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

  @Get(':id')
  @ApiOkResponse({
    type: CreatedInventory,
  })
  async findById(@Param('id') orgId: string): Promise<Inventory> {
    return this.inventoryService.findOne({
      _id: new Types.ObjectId(orgId),
    });
  }
}
