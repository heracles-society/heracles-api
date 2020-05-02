import { Injectable, Inject } from '@nestjs/common';
import { CreateSocietyDto } from './dto/society.dto';
import { Society } from './interface/society.interface';
import { SOCIETY_MODEL } from './constants';
import { Model } from 'mongoose';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class SocietiesService {
  constructor(
    @Inject(SOCIETY_MODEL) private readonly societyModel: Model<Society>,
    private readonly organizationService: OrganizationsService,
  ) {}

  async create(createSocietyDto: CreateSocietyDto): Promise<Society> {
    const { name, organization } = createSocietyDto;
    const organizationRecord = await this.organizationService.findOne({
      name: organization,
    });
    if (organizationRecord) {
      const createdSociety = new this.societyModel({
        name,
        organization: organizationRecord.id,
      });
      return createdSociety.save();
    }
    return null;
  }

  async findOne(params): Promise<Society> {
    return this.societyModel.findOne(params).exec();
  }

  async findAll(): Promise<Society[]> {
    return this.societyModel.find().exec();
  }
}
