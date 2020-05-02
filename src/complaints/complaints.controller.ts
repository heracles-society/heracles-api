import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/complaint.dto';
import { Complaint } from './interface/complaint.interface';

@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintService: ComplaintsService) {}

  @Post()
  async create(@Body() createComplaintDto: CreateComplaintDto) {
    this.complaintService.create(createComplaintDto);
  }

  @Get()
  async findAll(): Promise<Complaint[]> {
    return this.complaintService.findAll();
  }
}
