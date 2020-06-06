import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateSocietyDto extends BaseEntityDto {
  name: string;
  address: string;
  state: string;
  highlights: string;
  happinessIndex: number;
  safetyIndex: number;
  area: number;
  areaUnit: string;
  latitude: string;
  longitude: string;
}

export class CreatedSocietyDto extends CreateSocietyDto
  implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  namespace: string;
}

export class UpdateSocietyDto extends PartialType(CreateSocietyDto) {}
