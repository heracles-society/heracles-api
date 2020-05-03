import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  ServiceUnavailableException,
  Param,
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
    try {
      const society = await this.societyService.create(createCatDto);
      if (society === null) {
        throw new BadRequestException();
      }
      return society;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ServiceUnavailableException();
    }
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
    return this.societyService.findOne({
      _id: new Types.ObjectId(societyId),
    });
  }
}
