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
  modelName: string;
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
      description: 'Filter to apply on the query.',
      examples: {
        none: {
          value: null,
          description: 'No filtering applied',
        },
        matchExact: {
          value: 'name=test',
          description: 'querying for records matching name exactly as test',
        },
        matchRegex: {
          value: 'name__regex=test$',
          description: 'querying for records matching names ending with test',
        },
        matchIRegex: {
          value: 'name__iregex=test$',
          description:
            'querying for records matching with names (case insensitive) ending with test',
        },
        greater: {
          value: 'age__gt=12',
          description: 'querying for records matching with age greater than 12',
        },
        greaterThanOrEqual: {
          value: 'age__gte=12',
          description:
            'querying for records matching with age greater than or equal 12',
        },
        lesser: {
          value: 'age__lt=12',
          description: 'querying for records matching with age less than 12',
        },
        lesserThanOrEqual: {
          value: 'age__lte=12',
          description:
            'querying for records matching with age lesser than or equal to 12',
        },
        oneOf: {
          value: 'age__in=12&age__in=13',
          description:
            'querying for records matching with age either to 12 or 13',
        },
        and: {
          value: 'age__lte=12&name=test',
          description:
            'querying for records matching with age lesser than or equal to 12 AND name matching test exactly',
        },
        or: {
          value: 'age__lte=12|name=test',
          description:
            'querying for records matching with age lesser than or equal to 12 OR name matching test exactly',
        },
        complex: {
          value: 'breed__iregex=labrador&(age__lte=9&age__lte=8|name=test)',
          description:
            'querying for records matching regex (case insensitive) with breed equals to labrador AND (age lesser than 9 AND (age less than 8 or name equals test))',
        },
      },
      required: false,
      type: String,
    })
    @PaginatedAPIParams
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @RouteDecorators(METHOD_DECORATOR_TYPES.GET_ALL)
    @ApiOperation({ operationId: `${options.modelName}__find` })
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
    @ApiOperation({ operationId: `${options.modelName}__create` })
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
    @ApiOperation({ operationId: `${options.modelName}__find_one` })
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
    @ApiOperation({ operationId: `${options.modelName}__update_one` })
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
    @ApiOperation({ operationId: `${options.modelName}__patch_one` })
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
    @ApiOperation({ operationId: `${options.modelName}__delete_one` })
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
