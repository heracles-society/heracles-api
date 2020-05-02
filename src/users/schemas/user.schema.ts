import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobile: String,
    email: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
