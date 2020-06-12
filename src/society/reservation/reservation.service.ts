import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Reservation } from './reservation.model';
import { RESERVATION_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class ReservationService extends BaseService<Reservation> {
  constructor(
    @Inject(RESERVATION_PROVIDER) reservationModel: Model<Reservation>,
  ) {
    super(reservationModel);
  }
}
