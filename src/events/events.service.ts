import { Injectable, Inject } from '@nestjs/common';
import { EVENT_PROVIDER } from './constants';
import { Event } from './interface/event.interface';
import { Model, Types } from 'mongoose';
import { CreateEventDto, EventStatus, PatchEventDto } from './dto/event.dto';
import { UserService } from '../users/users.service';
import { ReservationService } from '../reservations/reservations.service';
import { Reservation } from '../reservations/interface/reservation.interface';
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
    private readonly reservationService: ReservationService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { createdBy, reservation, ...restProps } = createEventDto;
    const createdByRecord = await this.userService.findOne({
      _id: new Types.ObjectId(createdBy),
    });

    let reservationRecord;
    if (reservation) {
      reservationRecord = await this.reservationService.findOne({
        _id: new Types.ObjectId(createdBy),
      });
    }

    if (createdByRecord) {
      const createdEvent = new this.eventModel({
        ...restProps,
        status: EventStatus.PENDING,
        reservation: reservationRecord ? reservationRecord.id : null,
      });
      return createdEvent.save();
    }
    return null;
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
    const { reservation, ...restProps } = updateDoc;
    let reservationRecord: Reservation;
    if (reservation) {
      reservationRecord = await this.reservationService.findOne({
        _id: new Types.ObjectId(reservation),
      });
    }

    if (reservation ? reservationRecord : true) {
      const record = await this.eventModel.findOneAndUpdate(params, {
        ...restProps,
        reservation: reservation ? reservationRecord.id : null,
      });
      return record;
    }
    return null;
  }
}
