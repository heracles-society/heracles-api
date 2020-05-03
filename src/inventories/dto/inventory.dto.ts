export enum InventoryType {
  APARTMENT = 'APARTMENT',
  COMMUNITY_HALL = 'COMMUNITY_HALL',
}
export class CreateInventoryDto {
  name: string;
  type: InventoryType = InventoryType['APARTMENT'];
  society: string;
  owner: string;
  manager: string = null;
}

export class CreatedInventory extends CreateInventoryDto {}
