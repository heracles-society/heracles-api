import { Injectable, Inject } from '@nestjs/common';
import { RESERVATION_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { Reservation } from './interface/reservation.interface';
import {
  CreateReservationDto,
  PatchReservationDto,
} from './dto/reservation.dto';
import { InventoryService } from '../inventories/inventories.service';
import { UserService } from '../users/users.service';

@Injectable()
export class ReservationService {
  constructor(
    @Inject(RESERVATION_PROVIDER)
    private readonly reservationModel: Model<Reservation>,
    private readonly inventoryService: InventoryService,
    private readonly userService: UserService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { inventory, reservedBy, ...restProps } = createReservationDto;
    const inventoryRecord = await this.inventoryService.findOne({
      _id: new Types.ObjectId(inventory),
    });
    const reservedByRecord = await this.userService.findOne({
      _id: new Types.ObjectId(reservedBy),
    });

    if (inventoryRecord && reservedBy) {
      const createdReservation = new this.reservationModel({
        ...restProps,
        inventory: inventoryRecord.id,
        reservedBy: reservedByRecord.id,
      });
      return createdReservation.save();
    }
    return null;
  }

  async findOne(params: any): Promise<Reservation> {
    return this.reservationModel.findOne(params).exec();
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async updateOne(
    params: any,
    updateDoc: PatchReservationDto,
  ): Promise<Reservation> {
    const record = await this.reservationModel.findOneAndUpdate(params, {
      ...updateDoc,
    });
    return record;
  }
}
