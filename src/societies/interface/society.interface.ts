import { Document } from 'mongoose';

export interface Society extends Document {
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
