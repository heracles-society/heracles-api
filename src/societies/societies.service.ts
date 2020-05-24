import { Injectable, Inject } from '@nestjs/common';
import { CreateSocietyDto } from './dto/society.dto';
import { Society } from './interface/society.interface';
import { SOCIETY_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { OrganizationService } from '../organizations/organizations.service';
import { isArray } from 'util';
import { UserService } from '../users/users.service';

interface PaginatedSociety {
  data: Society[];
  total: number;
  cursor: Date;
}

@Injectable()
export class SocietyService {
  constructor(
    @Inject(SOCIETY_PROVIDER) private readonly societyModel: Model<Society>,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  async create(createSocietyDto: CreateSocietyDto): Promise<Society> {
    const { organization, managers, ...restProps } = createSocietyDto;
    const organizationRecord = await this.organizationService.findOne({
      _id: new Types.ObjectId(organization),
    });

    const managerRecords = [];
    await Promise.all(
      managers.map(async manager => {
        const managerRecord = await this.userService.findOne({
          _id: new Types.ObjectId(manager),
        });
        managerRecords.push(managerRecord);
      }),
    );

    const hasMissingManagers = managers.some(manager => manager === null);
    if (hasMissingManagers || managers.length === 0) {
      return null;
    }

    if (organizationRecord) {
      const createdSociety = new this.societyModel({
        ...restProps,
        organization: organizationRecord.id,
        managers: managerRecords.map(managerRecord => managerRecord.id),
      });
      return createdSociety.save();
    }
    return null;
  }

  async findOne(params): Promise<Society> {
    return this.societyModel.findOne(params).exec();
  }

  async findAll(
    query: object,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedSociety> {
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

    const data = await this.societyModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.societyModel.countDocuments(updatedQuery).exec();
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
