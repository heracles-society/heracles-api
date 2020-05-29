import * as mongoose from 'mongoose';
import { SOCIETY_MODEL } from '../../societies/constants';
import { USER_MODEL } from '../../users/constants';

export const EventSchema = new mongoose.Schema(
  {
    name: String,
    kind: String,
    description: String,
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SOCIETY_MODEL,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_MODEL,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
