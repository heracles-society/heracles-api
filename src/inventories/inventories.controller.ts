import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { InventoryService } from './inventories.service';
import { CreateInventoryDto, CreatedInventoryDto } from './dto/inventory.dto';
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
    type: CreatedInventoryDto,
  })
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<Inventory> {
    const society = await this.inventoryService.create(createInventoryDto);
    if (society === null) {
      throw new BadRequestException();
    }
    return society;
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedInventoryDto],
  })
  async findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
  })
  async findById(@Param('id') inventoryId: string): Promise<Inventory> {
    const inventoryRecord = this.inventoryService.findOne({
      _id: new Types.ObjectId(inventoryId),
    });
    if (inventoryRecord) {
      return inventoryRecord;
    }
    throw new NotFoundException();
  }
}
