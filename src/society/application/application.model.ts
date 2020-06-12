import { BaseModel } from '../../utils/base-module/base.model';
import { ApplicationPriority, ApplicationKind } from './application.dto';

export class Application extends BaseModel {
  kind: ApplicationKind;
  status: string;
  description: string;
  priority: ApplicationPriority;
  society: string;
  raisedBy: string;
  assignedTo?: string;
}
