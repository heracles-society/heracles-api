import { Get, Query, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BaseModel } from './base.model';
import { BaseService } from './base.service';
import { Request } from 'express';
import { parseQueryParamFilters } from '../helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from '../helpers/db.helpers';
import { IQueryOptions } from './base.interface';

interface IBaseControllerFactoryOptions<T extends BaseModel> {
  entity: { new (): T };
}

export function baseControllerFactory<T extends BaseModel>(
  options: IBaseControllerFactoryOptions<T>,
): Function {
  const Entity = options.entity;

  @ApiTags(Entity.name)
  abstract class BaseController {
    constructor(protected readonly baseService: BaseService<T>) {}

    @Get()
    @ApiOkResponse({
      type: [Entity],
    })
    @ApiQuery({
      name: 'q',
      description: 'Query filter',
      required: false,
      type: String,
    })
    @ApiOperation({ operationId: `${Entity.name}_Find` })
    public async find(@Query() query: any, @Req() req: Request) {
      const queryString: string = query.q;
      const { skip, limit, cursor } = query;
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

  return BaseController;
}
