import { Document } from 'mongoose';

export interface Complaint extends Document {
  name: string;
  kind: string;
  description: string;
  priority: number;
  society: string;
  raisedBy: string;
  status: string;
  assignedTo: string;
}
