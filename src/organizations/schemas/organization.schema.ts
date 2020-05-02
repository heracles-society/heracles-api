import * as mongoose from 'mongoose';

export const OrganizationSchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
