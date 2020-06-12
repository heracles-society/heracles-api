import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Req,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto, PatchEmergencyDto } from './dto/emergency.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EmergencyStatus, Emergency } from './interface/emergency.interface';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { UtilService } from '../utils/utils.service';
import { Types } from 'mongoose';

@ApiTags('emergency')
@Controller('emergency')
export class EmergencyController {
  constructor(
    private emergencyService: EmergencyService,
    private utilService: UtilService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreateEmergencyDto })
  async create(
    @Body() body: CreateEmergencyDto,
    @Req() req,
  ): Promise<CreateEmergencyDto> {
    const { conversations } = body;
    const { id } = req.user;
    const emergencyRecord = await this.emergencyService.create({
      conversations,
      userId: id,
      status: EmergencyStatus.PENDING,
      assignedTo: '',
    });
    if (emergencyRecord) {
      return emergencyRecord;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CreateEmergencyDto })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Emergency[]> {
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
    } = await this.emergencyService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CreateEmergencyDto })
  async patchById(
    @Param('id') id: string,
    @Body() patchEmergencyDto: PatchEmergencyDto,
  ) {
    const patchedEmergency = await this.emergencyService.updateOne(
      { _id: new Types.ObjectId(id) },
      patchEmergencyDto,
    );

    if (patchedEmergency) {
      return patchedEmergency;
    }
    throw new BadRequestException();
  }
}
