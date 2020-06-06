export interface IQueryOptions {
  $and?: any[];
  $or?: any[];
}

export interface IPaginationQuery {
  skip: number;
  limit: number;
  cursor?: number;
}

export interface IPaginatedResult<T> {
  cursor: number;
  total: number;
  data: T[];
}

export interface IBaseService<T> {
  find: (f: IQueryOptions) => Promise<IPaginatedResult<T>>;
  findOne: (query: IQueryOptions) => Promise<T>;
  findById: (i: string | number) => Promise<T>;
  create: (i: any) => Promise<T>;
  update: (id: string | number, i: any) => Promise<any>;
  delete: (i: string | number) => Promise<any>;
}
