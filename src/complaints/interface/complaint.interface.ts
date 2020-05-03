import { Document } from 'mongoose';

export interface Complaint extends Document {
  name: string;
  kind: string;
  description: string;
  priority: string;
  society: string;
  raisedBy: string;
  status: string;
  assignedTo: string;
}
