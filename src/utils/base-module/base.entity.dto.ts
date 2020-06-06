import { PartialType } from '@nestjs/swagger';

export class BaseEntityDto {}

export class CreatedBaseEntity extends BaseEntityDto {
  createdAt: Date;
  updatedAt: Date;
  namespace: string;
}

export class UpdateBaseEntity extends PartialType(BaseEntityDto) {}
