import { OrderStatus } from '../interface/orders.interface';

export class CreateOrdersDto {
  Kind: string;
  Amount: number;
  Description: string;
  createdFor: string;
  createdBy: string;
}

export class CreatedOrderDto extends CreateOrdersDto {
  Status: OrderStatus;
  metaField?: object;
}
