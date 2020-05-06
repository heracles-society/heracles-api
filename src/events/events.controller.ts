import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { EventService } from './events.service';
import {
  CreateEventDto,
  CreatedEventDto,
  PatchEventDto,
} from './dto/event.dto';
import { Event } from './interface/event.interface';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

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
  async findAll(): Promise<Event[]> {
    return this.eventService.findAll();
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
