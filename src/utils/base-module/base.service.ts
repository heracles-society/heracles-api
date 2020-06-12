import { Model } from 'mongoose';
import { isArray } from 'lodash';
import {
  IQueryOptions,
  IPaginatedResult,
  IBaseService,
  IPaginationQuery,
} from './base.interface';
import { BaseModel } from './base.model';
import { BaseEntityDto } from './base.entity.dto';
import { apply } from 'json-merge-patch';
export class BaseService<T extends BaseModel> implements IBaseService<T> {
  constructor(protected readonly baseModel: Model<T>) {}
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
    const count = await this.count(updatedQuery);
    const cursorId = data.length
      ? data[data.length - 1]['createdAt'].getTime()
      : null;
    return {
      total: count,
      data: data,
      cursor: cursorId,
    };
  }
  async findOne(query: IQueryOptions): Promise<T> {
    return await this.baseModel.findOne(query as any).exec();
  }

  async findById(id: string): Promise<T> {
    return await this.baseModel.findById(id).exec();
  }

  async create(entity: BaseEntityDto): Promise<T> {
    const createdEntity = new this.baseModel(entity);
    await createdEntity.save();
    return createdEntity;
  }

  async update(id: string, data: any): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    return await this.baseModel.findByIdAndUpdate({ _id: entity.id }, data);
  }

  async patch(id: string, data: any): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    const oldData = entity.toJSON();
    const updatedData = apply(oldData, data);
    return await this.baseModel.findOneAndUpdate(
      { _id: entity.id },
      updatedData as any,
      { new: true },
    );
  }

  async delete(id: string): Promise<any> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    await entity.remove();
    return entity;
  }

  async distinct(params: string, query: IQueryOptions): Promise<any> {
    return await this.baseModel.distinct(params, query);
  }

  async count(query: IQueryOptions): Promise<number> {
    return await this.baseModel.countDocuments(query as any).exec();
  }
}
