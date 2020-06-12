import { Controller, SetMetadata } from '@nestjs/common';

import {
  CreateReservationDto,
  CreatedReservationDto,
  UpdateReservationDto,
} from './reservation.dto';

import { ApiTags } from '@nestjs/swagger';

import { ReservationService } from './reservation.service';
import { RESERVATION_MODEL } from './constants';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { RoleService } from '../../role/role.service';
import { societyBaseNamespaceControllerFactory } from '../society.base.namespace.controller';
import { Reservation } from './reservation.model';

const BaseSocietyNamespacedReservationController = societyBaseNamespaceControllerFactory<
  Reservation
>({
  modelName: RESERVATION_MODEL,
  createEntitySchema: CreateReservationDto,
  createdEntitySchema: CreatedReservationDto,
  patchEntitySchema: UpdateReservationDto,
});

@ApiTags('reservations')
@Controller('societies/:societyId/reservations')
@SetMetadata('ResourceKind', RESERVATION_MODEL)
export class ReservationController extends BaseSocietyNamespacedReservationController {
  constructor(
    reservationService: ReservationService,
    roleService: RoleService,
    roleBindingService: RoleBindingService,
  ) {
    super(reservationService, roleService, roleBindingService);
  }
}
