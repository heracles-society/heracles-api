import { BaseModel } from '../../utils/base-module/base.model';

export class Reservation extends BaseModel {
  kind: string;
  inventory: string;
  fromDate: Date;
  toDate: Date;
  reservedBy: string;
  status: string;
}
