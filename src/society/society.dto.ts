import { BaseEntityDto } from '../utils/base-module/base.entity.dto';

export class CreateSocietyDto extends BaseEntityDto {
  name: string;
  organization: string;
  address: string;
  state: string;
  highlights: string;
  happinessIndex: number;
  safetyIndex: number;
  area: number;
  areaUnit: string;
  latitude: string;
  longitude: string;
  managers: string[];
}

export class CreatedSocietyDto extends CreateSocietyDto {}
