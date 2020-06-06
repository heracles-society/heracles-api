import { Document } from 'mongoose';
export class BaseModel extends Document {
  namespace: string;
  createdAt: Date;
  updatedAt: Date;
}
