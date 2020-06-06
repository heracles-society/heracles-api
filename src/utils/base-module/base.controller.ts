import { Get, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
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
      req.res.set('HERACLES-API-Cursor', newCursor.toString());
      return data;
    }
  }

  return class extends BaseController {};
}
