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
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { Request } from 'express';
import { parseQueryParamFilters } from '../helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from '../helpers/db.helpers';
import { IQueryOptions } from './base.interface';
import { BaseModel } from './base.model';
import { PaginatedAPIParams } from '../pagination.decorators';
import { JwtAuthGuard } from '../../auth/jwt.guard';
enum METHOD_DECORATOR_TYPES {
  GET_ALL = 'GET_ALL',
  POST = 'POST',
  GET_ONE = 'GET_ONE',
  PUT_ONE = 'PUT_ONE',
  PATCH_ONE = 'PATCH_ONE',
  DELETE_ONE = 'DELETE_ONE',
}
interface IBaseControllerFactoryOptions<T> {
  name: string;
  routeDecorators?: Function;
  entity: { new (): T };
  createEntitySchema: { new (): any };
  createdEntitySchema?: { new (): any };
  patchEntitySchema?: { new (): any };
}

export function baseControllerFactory<T extends BaseModel>(
  options: IBaseControllerFactoryOptions<T>,
): any {
  const CreateEntitySchema = options.createEntitySchema;
  const CreatedEntitySchema = options.createdEntitySchema;
  const PatchEntitySchema = options.patchEntitySchema;

  class CreateEntitySchemaKlass extends CreateEntitySchema {}
  class PatchEntitySchemaKlass extends PatchEntitySchema {}

  Object.defineProperty(CreateEntitySchemaKlass, 'name', {
    value: CreatedEntitySchema.name,
  });
  Object.defineProperty(PatchEntitySchemaKlass, 'name', {
    value: PatchEntitySchema.name,
  });

  const RouteDecorators = options.routeDecorators
    ? options.routeDecorators
    : () => applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));

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
    @RouteDecorators(METHOD_DECORATOR_TYPES.GET_ALL)
    @ApiOperation({ operationId: `${options.name}__Find` })
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
    @ApiBody({
      required: true,
      type: CreateEntitySchema,
      description: 'Data for entity creation',
      isArray: false,
    })
    @RouteDecorators(METHOD_DECORATOR_TYPES.POST)
    @ApiOperation({ operationId: `${options.name}__Create` })
    async create(@Body() entity: CreateEntitySchemaKlass) {
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
    @RouteDecorators(METHOD_DECORATOR_TYPES.GET_ONE)
    @ApiOperation({ operationId: `${options.name}__Find_One` })
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
    @ApiBody({
      required: true,
      type: CreateEntitySchema,
      description: 'Data for updating entity',
      isArray: false,
    })
    @RouteDecorators(METHOD_DECORATOR_TYPES.PUT_ONE)
    @ApiOperation({ operationId: `${options.name}__Update_One` })
    async updateById(
      @Param('id') entityId: string,
      @Body() body: CreateEntitySchemaKlass,
    ) {
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
    @ApiBody({
      type: PatchEntitySchema,
    })
    @RouteDecorators(METHOD_DECORATOR_TYPES.PATCH_ONE)
    @ApiOperation({ operationId: `${options.name}__Patch_One` })
    async patchById(
      @Param('id') entityId: string,
      @Body() body: PatchEntitySchemaKlass,
    ) {
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
    @RouteDecorators(METHOD_DECORATOR_TYPES.DELETE_ONE)
    @ApiOperation({ operationId: `${options.name}__Delete_One` })
    async deleteById(@Param('id') entityId: string) {
      const updatedEntity = await this.baseService.delete(entityId);
      if (updatedEntity) {
        return null;
      }
      throw new NotFoundException();
    }
  }

  return BaseController;
}
