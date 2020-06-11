import { Controller } from '@nestjs/common';
import { baseControllerFactory } from '../utils/base-module/base.controller';
import {
  CreateSocietyDto,
  CreatedSocietyDto,
  UpdateSocietyDto,
} from './society.dto';
import { Society } from './society.model';
import { SocietyService } from './society.service';
import { ApiTags } from '@nestjs/swagger';
import { SOCIETY_MODEL } from './constants';

const BaseSocietyController = baseControllerFactory<Society>({
  modelName: SOCIETY_MODEL,
  entity: Society,
  createEntitySchema: CreateSocietyDto,
  createdEntitySchema: CreatedSocietyDto,
  patchEntitySchema: UpdateSocietyDto,
});

@ApiTags('societies')
@Controller('societies')
export class SocietyController extends BaseSocietyController {
  constructor(societyService: SocietyService) {
    super(societyService);
  }
}
