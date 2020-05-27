export enum MessageType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export class MessageDeliveryMetaDto {
  recipient: string;
  deliveredAt: string;
  readAt: string;
}

export class CreateMessageDto {
  from: string;
  to: string;
  kind: MessageType = MessageType['DIRECT'];
  message: string;
}

export class CreatedMessageDto extends CreateMessageDto {
  deliveries: MessageDeliveryMetaDto[] = [];
}
