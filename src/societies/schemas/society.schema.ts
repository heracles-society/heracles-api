import * as mongoose from 'mongoose';

export const SocietySchema = new mongoose.Schema(
  {
    name: String,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
