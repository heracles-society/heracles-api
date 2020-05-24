import { Injectable, Inject } from '@nestjs/common';
import { ORGANIZATION_PROVIDER } from './constants';
import { Model } from 'mongoose';
import { Organization } from './interface/organization.interface';
import { CreateOrganizationDto } from './dto/organization.dto';
import { isArray } from 'util';

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
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const createdOrganization = new this.organizationModel(
      createOrganizationDto,
    );
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
