import { Document } from 'mongoose';

export class Reservation extends Document {
  kind: string;
  inventory: string;
  fromDate: Date;
  toDate: Date;
  reservedBy: string;
  status: string;
}
