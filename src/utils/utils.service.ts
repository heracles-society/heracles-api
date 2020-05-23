import { Injectable } from '@nestjs/common';
import {
  parseQueryParamFilters,
  QueryParamFilter,
} from './helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from './helpers/db.helpers';

@Injectable()
export class UtilService {
  async parseQueryParam(query: string): Promise<QueryParamFilter> {
    return parseQueryParamFilters(query);
  }

  async parseDBParam(queryParam: QueryParamFilter): Promise<any> {
    return parseQueryParamFilterToDBQuery(queryParam);
  }
}
