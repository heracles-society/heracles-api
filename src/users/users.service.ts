import { Injectable, Inject } from '@nestjs/common';
import { USER_MODEL } from './constants';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_MODEL) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
