import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Complaint } from './complaint.model';
import { COMPLAINT_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class ComplaintService extends BaseService<Complaint> {
  constructor(@Inject(COMPLAINT_PROVIDER) complaintModel: Model<Complaint>) {
    super(complaintModel);
  }
}
