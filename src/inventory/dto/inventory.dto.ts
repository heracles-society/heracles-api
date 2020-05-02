export enum InventoryType {
  APARTMENT = 'APARTMENT',
  COMMUNITY_HALL = 'COMMUNITY_HALL',
}
export class CreateInventoryDto {
  name: string;
  type: InventoryType = InventoryType['APARTMENT'];
  society: string;
}

export class CreatedInventory extends CreateInventoryDto {}
