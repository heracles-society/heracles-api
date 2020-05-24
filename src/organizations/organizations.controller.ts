import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Query,
  Req,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { UtilService } from '../utils/utils.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationService: OrganizationService,
    private utilService: UtilService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('organizations:create')
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
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Organization[]> {
    const queryString: string = query.q;
    const { skip, limit, cursor } = query;
    let params = {};
    if (queryString) {
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );
      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      params = finalDBQuery;
    }

    const {
      total,
      data,
      cursor: newCursor,
    } = await this.organizationService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
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
