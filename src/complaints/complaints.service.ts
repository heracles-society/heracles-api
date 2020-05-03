import { Injectable, Inject } from '@nestjs/common';
import { COMPLAINT_PROVIDER } from './constants';
import { Complaint } from './interface/complaint.interface';
import { Model, Types } from 'mongoose';
import { CreateComplaintDto, ComplaintStatus } from './dto/complaint.dto';
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
    const raisedByRecord = this.userService.findOne({
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

  async findOne(params): Promise<Complaint> {
    return this.complaintModel.findOne(params).exec();
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintModel.find().exec();
  }

  async updateOne(params, updateDoc): Promise<Complaint> {
    const record = await this.complaintModel.findOneAndUpdate(
      params,
      updateDoc,
    );
    return record;
  }
}
