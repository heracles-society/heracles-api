import { Document } from 'mongoose';
import { MessageFormatDto } from '../dto/emergency.dto';

export enum TypeValue {
  BOT_INITIATED = 'BOT_INITIATED',
  USER_INITIATED = 'USER_INITIATED',
}

export enum EmergencyStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REOPENED = 'REOPENED',
}

export interface Emergency extends Document {
  conversations: MessageFormatDto[];
  userId: string;
  status: string;
  assignedTo: string;
}
