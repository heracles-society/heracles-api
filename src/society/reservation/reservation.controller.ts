import { Controller, applyDecorators } from '@nestjs/common';
import {
  CreateReservationDto,
  CreatedReservationDto,
  UpdateReservationDto,
} from './reservation.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Reservation } from './reservation.model';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';

const BaseReservationController = baseControllerFactory<Reservation>({
  name: 'reservations',
  routeDecorators: () =>
    applyDecorators(
      ApiParam({
        name: 'societyId',
        required: true,
        type: String,
      }),
    ),
  entity: Reservation,
  createEntitySchema: CreateReservationDto,
  patchEntitySchema: UpdateReservationDto,
  createdEntitySchema: CreatedReservationDto,
});

@ApiTags('reservations')
@Controller('societies/:societyId/reservations')
export class ReservationController extends BaseReservationController {
  constructor(reservationService: ReservationService) {
    super(reservationService);
  }
}
