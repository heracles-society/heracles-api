import * as mongoose from 'mongoose';
import { SOCIETY_MODEL } from '../../societies/constants';
import { USER_MODEL } from '../../users/constants';

export const ComplaintSchema = new mongoose.Schema(
  {
    kind: String,
    status: String,
    description: String,
    priority: String,
    society: { type: mongoose.Schema.Types.ObjectId, ref: SOCIETY_MODEL },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
