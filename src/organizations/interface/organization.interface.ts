import { Document } from 'mongoose';

export interface Organization extends Document {
  readonly name: string;
}
