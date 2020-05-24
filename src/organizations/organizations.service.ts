import { Injectable, Inject } from '@nestjs/common';
import { ORGANIZATION_PROVIDER } from './constants';
import { Model, Types } from 'mongoose';
import { Organization } from './interface/organization.interface';
import { CreateOrganizationDto } from './dto/organization.dto';
import { isArray } from 'util';
import { UserService } from '../users/users.service';

interface PaginatedOrganization {
  data: Organization[];
  total: number;
  cursor: Date;
}

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(ORGANIZATION_PROVIDER)
    private readonly organizationModel: Model<Organization>,
    private readonly userService: UserService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const { owners, ...restProps } = createOrganizationDto;
    const ownerRecords = [];
    await Promise.all(
      owners.map(async owner => {
        const ownerRecord = await this.userService.findOne({
          _id: new Types.ObjectId(owner),
        });
        ownerRecords.push(ownerRecord);
      }),
    );

    const hasMissingOwners = owners.some(owner => owner === null);
    if (hasMissingOwners || owners.length === 0) {
      return null;
    }

    const createdOrganization = new this.organizationModel({
      ...restProps,
      owners: ownerRecords.map(owner => owner.id),
    });
    return createdOrganization.save();
  }

  async findOne(params): Promise<Organization> {
    return this.organizationModel.findOne(params).exec();
  }

  async findAll(
    query: object,
    options = { skip: 0, limit: 25, cursor: null },
  ): Promise<PaginatedOrganization> {
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

    const data = await this.organizationModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.organizationModel
      .countDocuments(updatedQuery)
      .exec();
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
