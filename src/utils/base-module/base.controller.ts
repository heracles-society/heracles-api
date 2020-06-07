import {
  Get,
  Query,
  Req,
  Post,
  Body,
  BadRequestException,
  Param,
  NotFoundException,
  Put,
  Delete,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { Request } from 'express';
import { parseQueryParamFilters } from '../helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from '../helpers/db.helpers';
import { IQueryOptions } from './base.interface';
import { BaseModel } from './base.model';
import { BaseEntityDto } from './base.entity.dto';
import { PaginatedAPIParams } from '../pagination.decorators';

interface IBaseControllerFactoryOptions<U> {
  entity: { new (): U };
  createdEntity: { new (): any };
}

export function baseControllerFactory<
  T extends BaseModel,
  U extends BaseEntityDto
>(options: IBaseControllerFactoryOptions<U>) {
  const EntitySchema = options.entity;
  const CreatedEntitySchema = options.createdEntity;

  abstract class BaseController {
    constructor(public baseService: BaseService<T>) {}

    @Get()
    @ApiOkResponse({
      type: [CreatedEntitySchema],
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
    @ApiOperation({ operationId: `${EntitySchema.name}_Find` })
    public async find(@Query() query: any, @Req() req: Request) {
      const queryString: string = query.q;
      const { skip = 0, limit = 10, cursor = null } = query;
      let params: IQueryOptions = {};
      if (queryString) {
        const parsedQueryString = parseQueryParamFilters(queryString);
        const finalDBQuery = parseQueryParamFilterToDBQuery(parsedQueryString);
        params = finalDBQuery;
      }

      const {
        total,
        data,
        cursor: newCursor,
      } = await this.baseService.find(params, { skip, limit, cursor });
      req.res.set('HERACLES-API-Total-Count', total.toString());
      req.res.set(
        'HERACLES-API-Cursor',
        newCursor ? newCursor.toString() : null,
      );
      return data;
    }

    @Post()
    @ApiCreatedResponse({
      description: 'The entity record has been successfully created.',
      type: CreatedEntitySchema,
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiOperation({ operationId: `${EntitySchema.name}_Create` })
    async create(@Body() entity: BaseEntityDto) {
      const createdEntity = await this.baseService.create(entity);
      if (createdEntity) {
        return createdEntity;
      }
      throw new BadRequestException();
    }

    @Get(':id')
    @ApiOkResponse({
      type: CreatedEntitySchema,
      description: 'Entity record found.',
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiOperation({ operationId: `${EntitySchema.name}_Find_One` })
    async findById(@Param('id') entityId: string) {
      const record = await this.baseService.findById(entityId);
      if (record) {
        return record;
      }
      throw new NotFoundException();
    }

    @Put(':id')
    @ApiOkResponse({
      type: CreatedEntitySchema,
      description: 'Entity record updated successfully.',
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiNotFoundResponse({
      description: 'Entity record not found.',
    })
    @ApiOperation({ operationId: `${EntitySchema.name}_Update_One` })
    async updateById(@Param('id') entityId: string, @Body() body) {
      const updatedEntity = await this.baseService.update(entityId, body);
      if (updatedEntity) {
        return updatedEntity;
      }
      throw new NotFoundException();
    }

    @Patch(':id')
    @ApiOkResponse({
      type: CreatedEntitySchema,
      description: 'Patched entity succesfully.',
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiNotFoundResponse({
      description: 'Entity record not found.',
    })
    @ApiOperation({ operationId: `${EntitySchema.name}_Patch_One` })
    async patchById(@Param('id') entityId: string, @Body() body) {
      const updatedEntity = await this.baseService.patch(entityId, body);
      if (updatedEntity) {
        return updatedEntity;
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
    @ApiOperation({ operationId: `${EntitySchema.name}_Delete_One` })
    async deleteById(@Param('id') entityId: string) {
      const updatedEntity = await this.baseService.delete(entityId);
      if (updatedEntity) {
        return null;
      }
      throw new NotFoundException();
    }
  }

  return class extends BaseController {};
}
