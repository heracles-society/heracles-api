import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateReservationDto extends BaseEntityDto {
  kind: string;
  inventory: string;
  fromDate: Date;
  toDate: Date;
  reservedBy: string;
  status: string;
}

export class CreatedReservationDto extends CreateReservationDto
  implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  society: string;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
