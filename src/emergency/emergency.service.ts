import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { EmergencyDto, PatchEmergencyDto } from './dto/emergency.dto';
import { Emergency } from './interface/emergency.interface';
import { EMERGENCY_PROVIDER } from './constant';
import { isArray } from 'util';

interface PaginatedUser {
  data: Emergency[];
  total: number;
  cursor: Date;
}
@Injectable()
export class EmergencyService {
  constructor(
    @Inject(EMERGENCY_PROVIDER)
    private readonly emergencyModal: Model<Emergency>,
  ) {}

  async create(emergencyDto: EmergencyDto) {
    const { conversations, userId, status, assignedTo } = emergencyDto;
    const emergencyRecord = new this.emergencyModal({
      conversations,
      userId,
      status,
      assignedTo,
    });
    return emergencyRecord.save();
  }

  async findOne(params: any): Promise<Emergency> {
    return this.emergencyModal.findOne(params).exec();
  }

  async findAll(
    query: Record<string, any>,
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
    const data = await this.emergencyModal
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.emergencyModal.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }

  async updateOne(
    params: any,
    updateDoc: PatchEmergencyDto,
  ): Promise<Emergency> {
    return this.emergencyModal.findOneAndUpdate(params, updateDoc, {
      new: true,
    });
  }
}
