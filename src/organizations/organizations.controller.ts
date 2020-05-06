import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Organization } from './interface/organization.interface';
import {
  CreateOrganizationDto,
  CreatedOrganization,
} from './dto/organization.dto';
import { OrganizationService } from './organizations.service';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: CreatedOrganization,
  })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organizationRecord = this.organizationService.create(
      createOrganizationDto,
    );
    if (organizationRecord) {
      return organizationRecord;
    }
    throw new BadRequestException();
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
  async findById(@Param('id') orgId: string): Promise<Organization> {
    const organizationRecord = this.organizationService.findOne({
      _id: new Types.ObjectId(orgId),
    });
    if (organizationRecord) {
      return organizationRecord;
    }
    throw new NotFoundException();
  }
}
