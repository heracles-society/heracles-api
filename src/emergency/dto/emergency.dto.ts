import { PartialType } from '@nestjs/swagger';

export class MessageFormatDto {
  kind: string;
  value: string;
}

export class CreateEmergencyDto {
  conversations: MessageFormatDto[];
}

export class EmergencyDto {
  conversations: MessageFormatDto[];
  userId: string;
  status: string;
  assignedTo: string;
}

export class PatchEmergencyDto extends PartialType(EmergencyDto) {}
