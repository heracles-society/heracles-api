import { Document } from 'mongoose';

export class Event extends Document {
  name: string;
  description: string;
  reservation?: string;
}
