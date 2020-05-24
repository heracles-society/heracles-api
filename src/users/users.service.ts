import { Injectable, Inject } from '@nestjs/common';
import { USER_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/user.dto';
import { isArray } from 'util';

interface PaginatedUser {
  data: User[];
  total: number;
  cursor: Date;
}

@Injectable()
export class UserService {
  constructor(@Inject(USER_PROVIDER) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(
    query: object,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedUser> {
    const { skip, limit, cursor } = options;
    let updatedQuery = {};
    if (cursor) {
      if (isArray(query['$and'])) {
        updatedQuery['$and'] = [
          { createdAt: { $gt: cursor } },
          ...query['$and'],
        ];
      } else {
        updatedQuery['$and'] = [{ createdAt: { $gt: cursor } }, query];
      }
    } else {
      updatedQuery = query;
    }

    const data = await this.userModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.userModel.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
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
