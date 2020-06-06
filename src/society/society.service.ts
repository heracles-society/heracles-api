import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../utils/base-module/base.service';
import { Society } from './society.model';
import { SOCIETY_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class SocietyService extends BaseService<Society> {
  constructor(@Inject(SOCIETY_PROVIDER) societyModel: Model<Society>) {
    super(societyModel);
  }
}
