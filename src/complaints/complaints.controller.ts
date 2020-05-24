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
  Query,
  Req,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { UtilService } from '../utils/utils.service';

@ApiTags('complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(
    private complaintService: ComplaintService,
    private utilService: UtilService,
  ) {}

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
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Complaint[]> {
    const queryString: string = query.q;
    const { skip, limit, cursor } = query;
    let params = {};
    if (queryString) {
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );
      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      params = finalDBQuery;
    }

    const {
      total,
      data,
      cursor: newCursor,
    } = await this.complaintService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
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
