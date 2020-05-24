export enum InventoryType {
  APARTMENT = 'APARTMENT',
  COMMUNITY_HALL = 'COMMUNITY_HALL',
}
export class CreateInventoryDto {
  name: string;
  kind: InventoryType = InventoryType['APARTMENT'];
  society: string;
  owners: string[];
  managers: string[] = [];
}

export class CreatedInventoryDto extends CreateInventoryDto {}
