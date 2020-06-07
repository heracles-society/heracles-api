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

const BaseSocietyController = baseControllerFactory<Society>({
  name: 'societies',
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
