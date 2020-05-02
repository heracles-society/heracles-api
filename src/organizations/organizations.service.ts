import { Injectable, Inject } from '@nestjs/common';
import { ORGANIZATION_MODEL } from './constants';
import { Model } from 'mongoose';
import { Organization } from './interface/organization.interface';
import { CreateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(ORGANIZATION_MODEL)
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

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find().exec();
  }
}
