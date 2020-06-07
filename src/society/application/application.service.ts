import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../utils/base-module/base.service';
import { Application } from './application.model';
import { APPLICATION_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class ApplicationService extends BaseService<Application> {
  constructor(
    @Inject(APPLICATION_PROVIDER) applicationModel: Model<Application>,
  ) {
    super(applicationModel);
  }
}
