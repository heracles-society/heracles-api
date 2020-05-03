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
    const {
      inventory,
      reservedBy,
      fromDate,
      toDate,
      ...restProps
    } = createReservationDto;
    const inventoryRecord = await this.inventoryService.findOne({
      _id: new Types.ObjectId(inventory),
    });
    const reservedByRecord = await this.userService.findOne({
      _id: new Types.ObjectId(reservedBy),
    });

    const reservationPossible =
      (await this.reservationModel
        .find({
          inventory: inventoryRecord.id,
          fromDate: { $gte: fromDate },
          toDate: { $lte: toDate },
        })
        .count()) > 0;

    if (inventoryRecord && reservedBy && reservationPossible) {
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
    const { fromDate, toDate, inventory, ...restProps } = updateDoc;
    const reservationRecord = await this.reservationModel.findOneAndUpdate(
      params,
      {
        ...updateDoc,
      },
    );

    if (reservationRecord) {
      const fromDateToCheck = fromDate ?? reservationRecord.fromDate;
      const toDateToCheck = toDate ?? reservationRecord.toDate;
      const inventoryIdToCheck = inventory ?? reservationRecord.inventory;

      const inventoryRecord = await this.inventoryService.findOne({
        _id: new Types.ObjectId(inventoryIdToCheck),
      });

      if (inventoryRecord) {
        const reservationPossible =
          (await this.reservationModel
            .find({
              inventory: inventoryRecord.id,
              fromDate: { $gte: fromDateToCheck },
              toDate: { $lte: toDateToCheck },
            })
            .count()) > 0;

        if (reservationPossible) {
          return this.reservationModel.findOneAndUpdate(
            { _id: reservationRecord.id },
            {
              ...restProps,
              fromDate: fromDateToCheck,
              toDate: toDateToCheck,
              inventory: inventoryRecord.id,
            },
          );
        }
      }
    }

    return null;
  }
}
