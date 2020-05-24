import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { EventService } from './events.service';
import {
  CreateEventDto,
  CreatedEventDto,
  PatchEventDto,
} from './dto/event.dto';
import { Event } from './interface/event.interface';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { UtilService } from '../utils/utils.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private eventService: EventService,
    private utilService: UtilService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatedEventDto,
  })
  async create(@Body() createEventDto: CreateEventDto) {
    const createdEvent = await this.eventService.create(createEventDto);
    if (createdEvent) {
      return createdEvent;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedEventDto],
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Event[]> {
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
    } = await this.eventService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedEventDto,
  })
  async findById(@Param('id') orgId: string): Promise<Event> {
    const event = await this.eventService.findOne({
      _id: new Types.ObjectId(orgId),
    });
    if (event) {
      return event;
    }
    throw new NotFoundException();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    type: CreatedEventDto,
  })
  async patchById(
    @Param('id') eventId: string,
    @Body() patchEventDto: PatchEventDto,
  ) {
    const patchedEvent = await this.eventService.updateOne(
      { _id: new Types.ObjectId(eventId) },
      patchEventDto,
    );

    if (patchedEvent) {
      return patchedEvent;
    }
    throw new BadRequestException();
  }
}
