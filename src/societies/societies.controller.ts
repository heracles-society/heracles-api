import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Society } from './interface/society.interface';
import { CreateSocietyDto } from './dto/society.dto';
import { SocietiesService } from './societies.service';

@Controller('societies')
export class SocietiesController {
  constructor(private readonly societyService: SocietiesService) {}

  @Post()
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
  async findAll(): Promise<Society[]> {
    return this.societyService.findAll();
  }
}
