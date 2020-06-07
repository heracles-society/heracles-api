import { BaseModel } from '../../utils/base-module/base.model';

export class Event extends BaseModel {
  name: string;
  kind: string;
  description: string;
  society: string;
  createdBy: string;
}
