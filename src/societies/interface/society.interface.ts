import { Document } from 'mongoose';

export interface Society extends Document {
  readonly name: string;
  readonly organization: string;
}
