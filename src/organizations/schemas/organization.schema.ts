import * as mongoose from 'mongoose';
import { USER_MODEL } from '../../users/constants';

export const OrganizationSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
