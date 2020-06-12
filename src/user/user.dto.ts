import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto extends BaseEntityDto {
  name: string;
  email: string;
  roles: string[];
  familyName?: string;
  givenName?: string;
  picture?: string;
  openId?: string;
}

export class CreatedUserDto extends CreateUserDto implements CreatedBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  namespace: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
