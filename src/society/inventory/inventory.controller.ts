import {
  Controller,
  UseGuards,
  SetMetadata,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Put,
  Patch,
  Delete,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import {
  CreateInventoryDto,
  CreatedInventoryDto,
  UpdateInventoryDto,
} from './inventory.dto';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { SocietyNamespaceGuard } from '../society.namespace.guard';
import { INVENTORY_MODEL } from './constants';
import { PaginatedAPIParams } from '../../utils/pagination.decorators';
import { IQueryOptions } from '../../utils/base-module/base.interface';
import { parseQueryParamFilters } from '../../utils/helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from '../../utils/helpers/db.helpers';
import { Request } from 'express';

@ApiTags('inventories')
@Controller('societies/:societyId/inventories')
@SetMetadata('ResourceKind', INVENTORY_MODEL)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SocietyNamespaceGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get()
  @ApiOkResponse({
    type: [CreatedInventoryDto],
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @SetMetadata('action', 'LIST')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__Find` })
  public async find(
    @Param('societyId') societyId: string,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const queryString: string = query.q;
    const { skip = 0, limit = 10, cursor = null } = query;
    let params: IQueryOptions = {
      $and: [
        {
          society: societyId,
        },
      ],
    };
    if (queryString) {
      const parsedQueryString = parseQueryParamFilters(
        queryString + `&society=${societyId}`,
      );
      const finalDBQuery = parseQueryParamFilterToDBQuery(parsedQueryString);
      params = finalDBQuery;
    }

    const {
      total,
      data,
      cursor: newCursor,
    } = await this.inventoryService.find(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total.toString());
    req.res.set('HERACLES-API-Cursor', newCursor ? newCursor.toString() : null);
    return data;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The entity record has been successfully created.',
    type: CreatedInventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiBody({
    required: true,
    type: CreateInventoryDto,
    description: 'Data for entity creation',
    isArray: false,
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'CREATE_ONE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__Create` })
  async create(
    @Param('societyId') societyId: string,
    @Body() entity: CreateInventoryDto,
  ) {
    const createdEntity = await this.inventoryService.create({
      ...entity,
      society: societyId,
    });
    if (createdEntity) {
      return createdEntity;
    }
    throw new BadRequestException();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
    description: 'Entity record found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'GET_ONE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__Find_One` })
  async findById(
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
  ) {
    const record = await this.inventoryService.findOne({
      $and: [
        {
          id: inventoryId,
          society: societyId,
        },
      ],
    });
    if (record) {
      return record;
    }
    throw new NotFoundException();
  }

  @Put(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
    description: 'Entity record updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiNotFoundResponse({
    description: 'Entity record not found.',
  })
  @ApiBody({
    required: true,
    type: CreateInventoryDto,
    description: 'Data for updating entity',
    isArray: false,
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'PUT_ONE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__Update_One` })
  async updateById(
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
    @Body() body: CreateInventoryDto,
  ) {
    const record = await this.inventoryService.findOne({
      $and: [
        {
          id: inventoryId,
          society: societyId,
        },
      ],
    });

    if (record) {
      const updatedEntity = await this.inventoryService.update(
        inventoryId,
        body,
      );
      if (updatedEntity) {
        return updatedEntity;
      }
    }

    throw new NotFoundException();
  }

  @Patch(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
    description: 'Patched entity succesfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiNotFoundResponse({
    description: 'Entity record not found.',
  })
  @ApiBody({
    type: UpdateInventoryDto,
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'PATCH_ONE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__Patch_One` })
  async patchById(
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
    @Body() body: UpdateInventoryDto,
  ) {
    const record = await this.inventoryService.findOne({
      $and: [
        {
          id: inventoryId,
          society: societyId,
        },
      ],
    });

    if (record) {
      const updatedEntity = await this.inventoryService.patch(
        inventoryId,
        body,
      );
      if (updatedEntity) {
        return updatedEntity;
      }
    }

    throw new NotFoundException();
  }

  @Delete(':id')
  @ApiOkResponse({
    type: null,
    status: HttpStatus.NO_CONTENT,
    description: 'Entity deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiNotFoundResponse({
    description: 'Entity record not found.',
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'DELETE_ONE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}_Delete_One` })
  async deleteById(
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
  ) {
    const record = await this.inventoryService.findOne({
      $and: [
        {
          id: inventoryId,
          society: societyId,
        },
      ],
    });

    if (record) {
      const updatedEntity = await this.inventoryService.delete(inventoryId);
      if (updatedEntity) {
        return null;
      }
    }

    throw new NotFoundException();
  }
}
