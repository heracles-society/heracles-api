import { Document } from 'mongoose';

export interface Orders extends Document {
  Razorpayid: string;
  Kind: string;
  Amount: number;
  Description: string;
  Status: OrderStatus;
  createdFor: string;
  createdBy: string;
  metaField?: object;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
