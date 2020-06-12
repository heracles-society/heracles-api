import { Controller, SetMetadata } from '@nestjs/common';

import { CreateEventDto, CreatedEventDto, UpdateEventDto } from './event.dto';

import { ApiTags } from '@nestjs/swagger';

import { EventService } from './event.service';
import { EVENT_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { Event } from './event.model';
import { namespaceBaseControllerFactory } from '../../utils/namespace-module/namespace.base.controller';

const BaseSocietyNamespacedEventController = namespaceBaseControllerFactory<
  Event
>({
  modelName: EVENT_MODEL,
  createEntitySchema: CreateEventDto,
  createdEntitySchema: CreatedEventDto,
  patchEntitySchema: UpdateEventDto,
});
@ApiTags('events')
@Controller('societies/:societyId/events')
@SetMetadata('ResourceKind', EVENT_MODEL)
export class EventController extends BaseSocietyNamespacedEventController {
  constructor(
    eventService: EventService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(eventService, roleService, roleBindingService);
  }
}
