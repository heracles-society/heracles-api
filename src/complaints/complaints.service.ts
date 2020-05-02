import { Injectable, Inject } from '@nestjs/common';
import { COMPLAINTS_MODEL } from './constants';
import { Complaint } from './interface/complaint.interface';
import { Model } from 'mongoose';
import { CreateComplaintDto } from './dto/complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @Inject(COMPLAINTS_MODEL) private readonly complaintModel: Model<Complaint>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    const createdComplaint = new this.complaintModel(createComplaintDto);
    return createdComplaint.save();
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintModel.find().exec();
  }
}
