import {
  BaseEntityDto,
  CreatedBaseEntity,
} from '../../utils/base-module/base.entity.dto';
import { PartialType } from '@nestjs/swagger';

export enum InventoryType {
  APARTMENT = 'APARTMENT',
  COMMUNITY_HALL = 'COMMUNITY_HALL',
}

export class CreateInventoryDto extends BaseEntityDto {
  name: string;
  kind: InventoryType = InventoryType['APARTMENT'];
  owners: string[];
  managers: string[] = [];
}

export class CreatedInventoryDto extends CreateInventoryDto
  implements CreatedBaseEntity {
  id: string;
  society: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}
