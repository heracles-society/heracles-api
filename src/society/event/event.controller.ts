import { Controller, applyDecorators } from '@nestjs/common';
import { CreateEventDto, CreatedEventDto, UpdateEventDto } from './event.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Event } from './event.model';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { EventService } from './event.service';

const BaseEventController = baseControllerFactory<Event>({
  name: 'events',
  routeDecorators: () =>
    applyDecorators(
      ApiParam({
        name: 'societyId',
        required: true,
        type: String,
      }),
    ),
  entity: Event,
  createEntitySchema: CreateEventDto,
  patchEntitySchema: UpdateEventDto,
  createdEntitySchema: CreatedEventDto,
});

@ApiTags('events')
@Controller('societies/:societyId/events')
export class EventController extends BaseEventController {
  constructor(eventService: EventService) {
    super(eventService);
  }
}
