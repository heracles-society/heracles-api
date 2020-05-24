import * as mongoose from 'mongoose';
import { ORGANIZATION_MODEL } from '../../organizations/constants';

export const SocietySchema = new mongoose.Schema(
  {
    name: String,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORGANIZATION_MODEL,
    },
    address: String,
    state: String,
    highlights: String,
    happinessIndex: Number,
    safetyIndex: Number,
    area: Number,
    areaUnit: String,
    latitude: String,
    longiture: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
