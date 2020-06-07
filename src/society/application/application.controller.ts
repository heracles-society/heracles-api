import { Controller, applyDecorators } from '@nestjs/common';
import {
  CreateApplicationDto,
  CreatedApplicationDto,
  UpdateApplicationDto,
} from './application.dto';
import { baseControllerFactory } from '../../utils/base-module/base.controller';
import { Application } from './application.model';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ApplicationService } from './application.service';

const BaseApplicationController = baseControllerFactory<Application>({
  name: 'applications',
  routeDecorators: () =>
    applyDecorators(
      ApiParam({
        name: 'societyId',
        required: true,
        type: String,
      }),
    ),
  entity: Application,
  createEntitySchema: CreateApplicationDto,
  patchEntitySchema: UpdateApplicationDto,
  createdEntitySchema: CreatedApplicationDto,
});

@ApiTags('applications')
@Controller('societies/:societyId/applications')
export class ApplicationController extends BaseApplicationController {
  constructor(applicationService: ApplicationService) {
    super(applicationService);
  }
}
