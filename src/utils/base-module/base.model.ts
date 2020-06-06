import { Document } from 'mongoose';

export interface BaseModel extends Document {
  namespace: string;
  createdAt: Date;
  updatedAt: Date;
}
