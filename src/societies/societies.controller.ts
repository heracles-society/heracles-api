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
  Req,
} from '@nestjs/common';
import { Society } from './interface/society.interface';
import { CreateSocietyDto, CreatedSocietyDto } from './dto/society.dto';
import { SocietyService } from './societies.service';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UtilService } from '../utils/utils.service';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { InventoryService } from '../inventories/inventories.service';
import { InventoryType } from '../inventories/dto/inventory.dto';
import { Inventory } from '../inventories/interface/inventory.interface';

@ApiTags('societies')
@Controller('societies')
export class SocietiesController {
  constructor(
    private readonly societyService: SocietyService,
    private utilService: UtilService,
    private inventoryService: InventoryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: CreatedSocietyDto,
  })
  async create(@Body() createCatDto: CreateSocietyDto): Promise<Society> {
    const societyRecord = await this.societyService.create(createCatDto);
    if (societyRecord) {
      return societyRecord;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedSocietyDto],
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Society[]> {
    const queryString: string = query.q;
    const { skip, limit, cursor } = query;
    let params = {};
    if (queryString) {
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );
      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      params = finalDBQuery;
    }

    const {
      total,
      data,
      cursor: newCursor,
    } = await this.societyService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedSocietyDto,
  })
  async findById(@Param('id') societyId: string): Promise<Society> {
    const societyRecord = await this.societyService.findOne({
      _id: new Types.ObjectId(societyId),
    });
    if (societyRecord) {
      return societyRecord;
    }
    throw new NotFoundException();
  }

  @Get(':id/apartments')
  @ApiOkResponse({
    type: CreatedSocietyDto,
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findSocietyApartments(
    @Query() query,
    @Param('id') societyId: string,
    @Req() req,
  ): Promise<Inventory[]> {
    const societyRecord = await this.societyService.findOne({
      _id: new Types.ObjectId(societyId),
    });
    if (societyRecord) {
      const { skip, limit, cursor, q: queryString } = query;
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );

      parsedQueryString.andQueries.unshift({
        society: societyRecord.id,
        kind: InventoryType.APARTMENT,
      });

      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      const {
        total,
        data: apartments,
        cursor: newCursor,
      } = await this.inventoryService.findAll(finalDBQuery, {
        skip,
        limit,
        cursor,
      });
      req.res.set('HERACLES-API-Total-Count', total);
      req.res.set('HERACLES-API-Cursor', newCursor);
      return apartments;
    }
    throw new NotFoundException();
  }
}
