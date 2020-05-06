import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ComplaintService } from './complaints.service';
import {
  CreateComplaintDto,
  CreatedComplaintDto,
  PatchComplaintDto,
} from './dto/complaint.dto';
import { Complaint } from './interface/complaint.interface';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintService: ComplaintService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatedComplaintDto,
  })
  async create(@Body() createComplaintDto: CreateComplaintDto) {
    const createdComplaint = await this.complaintService.create(
      createComplaintDto,
    );
    if (createdComplaint) {
      return createdComplaint;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedComplaintDto],
  })
  async findAll(): Promise<Complaint[]> {
    return this.complaintService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedComplaintDto,
  })
  async findById(@Param('id') orgId: string): Promise<Complaint> {
    const complaint = await this.complaintService.findOne({
      _id: new Types.ObjectId(orgId),
    });
    if (complaint) {
      return complaint;
    }
    throw new NotFoundException();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    type: CreatedComplaintDto,
  })
  async patchById(
    @Param('id') id: string,
    @Body() patchComplaintDto: PatchComplaintDto,
  ) {
    const patchedComplaint = await this.complaintService.updateOne(
      { _id: new Types.ObjectId(id) },
      patchComplaintDto,
    );

    if (patchedComplaint) {
      return patchedComplaint;
    }
    throw new BadRequestException();
  }
}
