import { Controller } from '@nestjs/common';
import { CreateReservationDto, CreatedReservationDto } from './reservation.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Reservation } from './reservation.model';
import { ApiTags } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';

const BaseReservationController = baseControllerFactory<
  Reservation,
  CreateReservationDto
>({
  entity: CreateReservationDto,
  createdEntity: CreatedReservationDto,
});

@ApiTags('reservation')
@Controller('societies/:societyId/reservation')
export class ReservationController extends BaseReservationController {
  constructor(reservationService: ReservationService) {
    super(reservationService);
  }
}
