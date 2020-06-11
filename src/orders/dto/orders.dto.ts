import { OrderStatus } from '../interface/orders.interface';

export class CreateOrdersDto {
  kind: string;
  amount: number;
  description: string;
  createdFor: string;
  createdBy: string;
}

export class CreatedOrderDto extends CreateOrdersDto {
  status: OrderStatus;
  metaField: object;
}
