import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Event } from './event.model';
import { EVENT_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(@Inject(EVENT_PROVIDER) eventModel: Model<Event>) {
    super(eventModel);
  }
}
