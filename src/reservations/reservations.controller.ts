import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Patch,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservationService } from './reservations.service';
import {
  CreatedReservationDto,
  CreateReservationDto,
  PatchReservationDto,
} from './dto/reservation.dto';
import { Reservation } from './interface/reservation.interface';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UtilService } from '../utils/utils.service';
import { PaginatedAPIParams } from '../utils/pagination.decorators';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private reservationService: ReservationService,
    private utilService: UtilService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatedReservationDto,
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const society = await this.reservationService.create(createReservationDto);
    if (society === null) {
      throw new BadRequestException();
    }
    return society;
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedReservationDto],
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Reservation[]> {
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
    } = await this.reservationService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedReservationDto,
  })
  async findById(@Param('id') reservationId: string): Promise<Reservation> {
    const reservationRecord = await this.reservationService.findOne({
      _id: new Types.ObjectId(reservationId),
    });
    if (reservationRecord) {
      return reservationRecord;
    }
    throw new NotFoundException();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    type: CreatedReservationDto,
  })
  async patchById(
    @Param('id') reservationId: string,
    @Body() patchReservationDto: PatchReservationDto,
  ) {
    const patchedReservation = await this.reservationService.updateOne(
      { _id: new Types.ObjectId(reservationId) },
      patchReservationDto,
    );

    if (patchedReservation) {
      return patchedReservation;
    }
    throw new BadRequestException();
  }
}
