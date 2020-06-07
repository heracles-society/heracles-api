import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSocietyDto extends BaseEntityDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  highlights: string;
  @IsNotEmpty()
  happinessIndex: number;
  @IsNotEmpty()
  safetyIndex: number;
  @IsNotEmpty()
  area: number;
  @IsNotEmpty()
  areaUnit: string;
  @IsNotEmpty()
  latitude: string;
  @IsNotEmpty()
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
