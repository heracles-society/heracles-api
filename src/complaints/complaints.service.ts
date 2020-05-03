import { Injectable, Inject } from '@nestjs/common';
import { COMPLAINT_PROVIDER } from './constants';
import { Complaint } from './interface/complaint.interface';
import { Model, Types } from 'mongoose';
import {
  CreateComplaintDto,
  ComplaintStatus,
  PatchComplaintDto,
} from './dto/complaint.dto';
import { UserService } from '../users/users.service';

@Injectable()
export class ComplaintService {
  constructor(
    @Inject(COMPLAINT_PROVIDER)
    private readonly complaintModel: Model<Complaint>,
    private readonly userService: UserService,
  ) {}

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    const { raisedBy, ...restProps } = createComplaintDto;
    const raisedByRecord = await this.userService.findOne({
      _id: new Types.ObjectId(raisedBy),
    });

    if (raisedByRecord) {
      const createdComplaint = new this.complaintModel({
        ...restProps,
        status: ComplaintStatus.PENDING,
        assignedTo: null,
      });
      return createdComplaint.save();
    }
    return null;
  }

  async findOne(params: any): Promise<Complaint> {
    return this.complaintModel.findOne(params).exec();
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintModel.find().exec();
  }

  async updateOne(
    params: any,
    updateDoc: PatchComplaintDto,
  ): Promise<Complaint> {
    const { raisedBy, ...restProps } = updateDoc;
    const raisedByRecord = await this.userService.findOne({
      _id: new Types.ObjectId(raisedBy),
    });

    if (raisedBy ? raisedByRecord : true) {
      const record = await this.complaintModel.findOneAndUpdate(params, {
        ...restProps,
        raisedBy: raisedBy ? raisedByRecord.id : null,
      });
      return record;
    }
    return null;
  }
}
