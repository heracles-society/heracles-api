import { Document } from 'mongoose';

export class Event extends Document {
  name: string;
  kind: string;
  description: string;
  society: string;
  createdBy: string;
}
