import { Injectable, Inject } from '@nestjs/common';
import { EVENT_PROVIDER } from './constants';
import { Event } from './interface/event.interface';
import { Model, Types } from 'mongoose';
import { CreateEventDto, EventStatus, PatchEventDto } from './dto/event.dto';
import { UserService } from '../users/users.service';
import { SocietyService } from '../societies/societies.service';
import { Society } from '../societies/interface/society.interface';
import { isArray } from 'util';

interface PaginatedEvent {
  data: Event[];
  total: number;
  cursor: Date;
}

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_PROVIDER)
    private readonly eventModel: Model<Event>,
    private readonly userService: UserService,
    private readonly society: SocietyService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { createdBy, society, ...restProps } = createEventDto;
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(createdBy),
    });

    const societyRecord = await this.society.findOne({
      _id: new Types.ObjectId(society),
    });

    if (!societyRecord || !user) {
      return null;
    }

    const createdEvent = new this.eventModel({
      ...restProps,
      status: EventStatus.PENDING,
      society: societyRecord.id,
      createdBy: user.id,
    });

    return createdEvent.save();
  }

  async findOne(params: any): Promise<Event> {
    return this.eventModel.findOne(params).exec();
  }

  async findAll(
    query: object,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedEvent> {
    const { skip, limit, cursor } = options;
    let updatedQuery = {};
    if (cursor) {
      if (isArray(query['$and'])) {
        updatedQuery['$and'] = [
          { createdAt: { $gt: cursor } },
          ...query['$and'],
        ];
      } else {
        updatedQuery['$and'] = [{ createdAt: { $gt: cursor } }, query];
      }
    } else {
      updatedQuery = query;
    }

    const data = await this.eventModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.eventModel.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }

  async updateOne(params: any, updateDoc: PatchEventDto): Promise<Event> {
    const { society, ...restProps } = updateDoc;
    let societyRecord: Society;
    if (society) {
      societyRecord = await this.society.findOne({
        _id: new Types.ObjectId(society),
      });
    }

    if (society ? societyRecord : true) {
      const record = await this.eventModel.findOneAndUpdate(params, {
        ...restProps,
        society: society ? societyRecord.id : null,
      });
      return record;
    }
    return null;
  }
}
