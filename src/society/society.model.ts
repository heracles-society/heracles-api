import { BaseModel } from '../utils/base-module/base.model';

export class Society extends BaseModel {
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
