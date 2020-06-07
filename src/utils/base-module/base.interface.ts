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
  find: (
    query: IQueryOptions,
    options: IPaginationQuery,
  ) => Promise<IPaginatedResult<T>>;
  findOne: (query: IQueryOptions) => Promise<T>;
  findById: (id: string) => Promise<T>;
  create: (data: any) => Promise<T>;
  update: (id: string, data: any) => Promise<T>;
  patch: (id: string, data: any) => Promise<T>;
  delete: (id: string) => Promise<T>;
}
