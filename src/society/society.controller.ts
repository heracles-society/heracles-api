import { Controller } from '@nestjs/common';
import { baseControllerFactory } from '../utils/base-module/base.controller';
import { CreateSocietyDto, CreatedSocietyDto } from './society.dto';
import { Society } from './society.model';
import { SocietyService } from './society.service';
import { ApiTags } from '@nestjs/swagger';

const BaseSocietyController = baseControllerFactory<Society, CreateSocietyDto>({
  entity: CreateSocietyDto,
  createdEntity: CreatedSocietyDto,
});

@ApiTags('societies')
@Controller('societies')
export class SocietyController extends BaseSocietyController {
  constructor(societyService: SocietyService) {
    super(societyService);
  }
}
