import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Param,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventories.service';
import {
  CreateInventoryDto,
  CreatedInventoryDto,
  InventoryType,
} from './dto/inventory.dto';
import { Inventory } from './interface/inventory.interface';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UtilService } from '../utils/utils.service';
// import { parseQueryParamFilters } f../utils_oldutils';
@ApiTags('inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(
    private inventoryService: InventoryService,
    private utilService: UtilService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'kind',
    description: 'Inventory kind',
    required: false,
    enum: InventoryType,
    type: String,
  })
  async findAll(
    @Query('kind') inventoryKind: string,
    @Query('q') queryString: string,
  ): Promise<any> {
    const params = {};
    if (queryString) {
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );
      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      return finalDBQuery;
    } else {
      if (inventoryKind) {
        params['kind'] = inventoryKind;
      }
    }
    return this.inventoryService.findAll(params);
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
