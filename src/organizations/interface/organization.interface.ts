import { Document } from 'mongoose';

export interface Organization extends Document {
  name: string;
  description: string;
  owners: string[];
}
