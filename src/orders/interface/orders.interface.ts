import { Document } from 'mongoose';

export interface Orders extends Document {
  razorpayid: string;
  kind: string;
  amount: number;
  description: string;
  status: OrderStatus;
  createdFor: string;
  createdBy: string;
  metaField: object;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
