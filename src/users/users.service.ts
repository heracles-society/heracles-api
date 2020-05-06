import { Injectable, Inject } from '@nestjs/common';
import { USER_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_PROVIDER) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(params: any): Promise<User> {
    return this.userModel.findOne(params).exec();
  }

  async findOneById(userId: string): Promise<User> {
    return this.findOne({
      _id: new Types.ObjectId(userId),
    });
  }
}
