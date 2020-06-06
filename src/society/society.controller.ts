import { Controller } from '@nestjs/common';
import { baseControllerFactory } from '../utils/base-module/base.controller';
import { CreateSocietyDto, CreatedSocietyDto } from './society.dto';
import { Society } from './society.model';

const SocietyControllerBase = baseControllerFactory<Society, CreateSocietyDto>({
  entity: CreateSocietyDto,
  createdEntity: CreatedSocietyDto,
});

@Controller('society')
export class SocietyController extends SocietyControllerBase {}
