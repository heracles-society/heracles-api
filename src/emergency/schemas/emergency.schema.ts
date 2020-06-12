import * as mongoose from 'mongoose';

export const EmergencySchema = new mongoose.Schema(
  {
    conversations: [
      {
        _id: false,
        kind: String,
        value: String,
      },
    ],
    userId: String,
    status: String,
    assignedTo: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
