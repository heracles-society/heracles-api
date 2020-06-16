import { BaseModel } from '../../utils/base-module/base.model';
import { OrderStatus } from './order.dto';

export class Order extends BaseModel {
  amount: number;
  description: string;
  status: OrderStatus;
  createdFor: string;
  createdBy: string;
  metadata: object;
}
