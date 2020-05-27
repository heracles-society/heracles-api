import { Injectable, Inject } from '@nestjs/common';
import { MESSAGE_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { Message } from './interface/message.interface';
import { CreateMessageDto } from './dto/message.dto';
import { UserService } from '../users/users.service';
import { isArray } from 'util';

interface PaginatedMessage {
  data: Message[];
  total: number;
  cursor: Date;
}

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_PROVIDER)
    private readonly messageModel: Model<Message>,
    private readonly userService: UserService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { from, to, ...restProps } = createMessageDto;

    const fromUser = await this.userService.findOne({
      _id: new Types.ObjectId(from),
    });

    const targetAudience = await this.userService.findOne({
      _id: new Types.ObjectId(to),
    });

    if (!fromUser || !targetAudience) {
      return null;
    }

    const createdMessage = new this.messageModel({
      ...restProps,
      to: targetAudience.id,
      from: fromUser.id,
      deliveries: [],
    });

    return createdMessage.save();
  }

  async findOne(params): Promise<Message> {
    return this.messageModel.findOne(params).exec();
  }

  async findAll(
    query: object,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedMessage> {
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

    const data = await this.messageModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.messageModel.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }
}
