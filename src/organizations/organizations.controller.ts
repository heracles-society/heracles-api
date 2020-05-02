import { Controller, Post, Body, Get } from '@nestjs/common';
import { Organization } from './interface/organization.interface';
import { CreateOrganizationDto } from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }
}
