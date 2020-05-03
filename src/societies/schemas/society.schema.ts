import * as mongoose from 'mongoose';
import { ORGANIZATION_MODEL } from '../../organizations/constants';

export const SocietySchema = new mongoose.Schema(
  {
    name: String,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORGANIZATION_MODEL,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
