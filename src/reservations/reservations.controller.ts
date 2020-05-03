import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReservationService } from './reservations.service';
import {
  CreatedReservationDto,
  CreateReservationDto,
  PatchReservationDto,
} from './dto/reservation.dto';
import { Reservation } from './interface/reservation.interface';
import { Types } from 'mongoose';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private reservationService: ReservationService) {}

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
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
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

  @Patch(':id')
  @ApiOkResponse({
    type: CreatedReservationDto,
  })
  async patchById(
    @Param() reservationId: string,
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
