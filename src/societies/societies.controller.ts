import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Society } from './interface/society.interface';
import { CreateSocietyDto, CreatedSocietyDto } from './dto/society.dto';
import { SocietyService } from './societies.service';
import { ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('societies')
@Controller('societies')
export class SocietiesController {
  constructor(private readonly societyService: SocietyService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedSocietyDto,
  })
  async create(@Body() createCatDto: CreateSocietyDto): Promise<Society> {
    const societyRecord = await this.societyService.create(createCatDto);
    if (societyRecord) {
      return societyRecord;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedSocietyDto],
  })
  async findAll(): Promise<Society[]> {
    return this.societyService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedSocietyDto,
  })
  async findById(@Param('id') societyId: string): Promise<Society> {
    const societyRecord = this.societyService.findOne({
      _id: new Types.ObjectId(societyId),
    });
    if (societyRecord) {
      return societyRecord;
    }
    throw new NotFoundException();
  }
}
