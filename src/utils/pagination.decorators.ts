import { applyDecorators, NestMiddleware, Injectable } from '@nestjs/common';
import { toNumber, isFinite } from 'lodash';
import { isValid } from 'date-fns';
import { ApiQuery } from '@nestjs/swagger';

@Injectable()
export class PaginatedAPIMiddleware implements NestMiddleware {
  use(request: any, response: any, next: () => void) {
    const skip = toNumber(request.query.skip);
    const limit = toNumber(request.query.limit);
    const cursor = new Date(toNumber(request.query.cursor));

    request.query.skip = isFinite(skip) ? skip : 0;
    request.query.limit = isFinite(limit) ? (limit > 100 ? 100 : limit) : 10;
    request.query.cursor = isValid(cursor) ? cursor : '';
    next();
  }
}

export const PaginatedAPIParams = applyDecorators(
  ...[
    ApiQuery({
      name: 'skip',
      description: 'Results to skip',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Number of results to fetch',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'cursor',
      description: 'Last fetched cursor id',
      required: false,
      type: String,
    }),
  ],
);
