import { Document } from 'mongoose';
import { MessageType, MessageDeliveryMetaDto } from '../dto/message.dto';

export interface Message extends Document {
  from: string;
  to: string;
  deliveries: MessageDeliveryMetaDto[];
  kind: MessageType;
  message: string;
}
