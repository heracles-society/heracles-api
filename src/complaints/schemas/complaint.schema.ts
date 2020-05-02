import * as mongoose from 'mongoose';

export const ComplaintSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    priority: Number,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
