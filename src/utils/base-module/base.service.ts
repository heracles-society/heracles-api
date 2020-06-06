import { Model } from 'mongoose';
import { isArray } from 'lodash';
import {
  IQueryOptions,
  IPaginatedResult,
  IBaseService,
  IPaginationQuery,
} from './base.interface';
import { BaseModel } from './base.model';

export class BaseService<T extends BaseModel> implements IBaseService<T> {
  constructor(private readonly baseModel: Model<T>) {}
  async find(
    query: IQueryOptions,
    options: IPaginationQuery = { skip: 0, limit: 25, cursor: null },
  ): Promise<IPaginatedResult<T>> {
    const { skip, limit, cursor } = options;
    let updatedQuery = {};
    if (cursor) {
      if (isArray(query['$and'])) {
        updatedQuery['$and'] = [
          { createdAt: { $gt: cursor } },
          ...query['$and'],
        ];
      } else {
        updatedQuery['$and'] = [{ createdAt: { $gt: cursor } }, query];
      }
    } else {
      updatedQuery = query;
    }

    const data = await this.baseModel
      .find(updatedQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.baseModel.countDocuments(updatedQuery).exec();
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }
  findOne: (query: IQueryOptions) => Promise<T>;
  findById: (i: string | number) => Promise<T>;
  create: (i: any) => Promise<T>;
  update: (id: string | number, i: any) => Promise<any>;
  delete: (i: string | number) => Promise<any>;
}
