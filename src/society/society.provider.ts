import * as mongoose from 'mongoose';
import { SOCIETY_PROVIDER, SOCIETY_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';
const SocietySchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    state: String,
    highlights: String,
    happinessIndex: Number,
    safetyIndex: Number,
    area: Number,
    areaUnit: String,
    latitude: String,
    longitude: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class SocietyProvider {
  static getProviders() {
    return [
      {
        provide: SOCIETY_PROVIDER,
        useFactory: (mongoose: mongoose.Mongoose) =>
          mongoose.model(SOCIETY_MODEL, SocietySchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
