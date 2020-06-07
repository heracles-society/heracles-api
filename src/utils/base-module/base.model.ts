import { Document } from 'mongoose';
export class BaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
}
