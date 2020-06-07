import { BaseModel } from '../../utils/base-module/base.model';

export class Complaint extends BaseModel {
  kind: string;
  description: string;
  priority: string;
  society: string;
  raisedBy: string;
  status: string;
  assignedTo: string;
}
