import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateOrdersDto, CreatedOrderDto } from './dto/orders.dto';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { Orders } from './interface/orders.interface';
import { UtilService } from '../utils/utils.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private orderService: OrdersService,
    private utilService: UtilService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: CreateOrdersDto })
  async create(
    @Body() createOrderDto: CreateOrdersDto,
  ): Promise<CreatedOrderDto> {
    const { kind, amount, description, createdFor, createdBy } = createOrderDto;
    const newOrder = await this.orderService.create({
      kind,
      amount,
      description,
      createdFor,
      createdBy,
    });
    if (newOrder) {
      return newOrder;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CreateOrdersDto })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Orders[]> {
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
    } = await this.orderService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }

  // POST CALL FOR WEBHOOK
}
