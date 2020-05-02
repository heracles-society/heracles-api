import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Organization } from './interface/organization.interface';
import {
  CreateOrganizationDto,
  CreatedOrganization,
} from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedOrganization,
  })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOkResponse({
    type: CreatedOrganization,
  })
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedOrganization,
  })
  async findById(@Param('id') userId: string): Promise<Organization> {
    return this.organizationService.findOne({
      _id: new Types.ObjectId(userId),
    });
  }
}
