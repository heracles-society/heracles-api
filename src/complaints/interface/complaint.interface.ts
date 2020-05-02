import { Document } from 'mongoose';

export interface Complaint extends Document {
  name: string;
  type: string;
  priority: number;
  society: string;
  user: string;
  status: string;
}
