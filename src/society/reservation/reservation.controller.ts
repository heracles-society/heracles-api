import { Controller } from '@nestjs/common';
import {
  CreateReservationDto,
  CreatedReservationDto,
  UpdateReservationDto,
} from './reservation.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Reservation } from './reservation.model';
import { ApiTags } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';

const BaseReservationController = baseControllerFactory<Reservation>({
  name: 'reservation',
  entity: Reservation,
  createEntitySchema: CreateReservationDto,
  patchEntitySchema: UpdateReservationDto,
  createdEntitySchema: CreatedReservationDto,
});

@ApiTags('reservation')
@Controller('societies/:societyId/reservation')
export class ReservationController extends BaseReservationController {
  constructor(reservationService: ReservationService) {
    super(reservationService);
  }
}
