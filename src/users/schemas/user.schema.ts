import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    roles: [String],
    familyName: String,
    givenName: String,
    picture: String,
    openId: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
