import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../utils/base-module/base.service';
import { User } from './user.model';
import { USER_PROVIDER } from './constants';
import { Model } from 'mongoose';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@Inject(USER_PROVIDER) userModel: Model<User>) {
    super(userModel);
  }
}
