import { QueryParamFilter } from './api.helpers';
import { isArray, toNumber, isNumber } from 'lodash';

const getDBQuery = (key: string, value: any) => {
  let dbParam = key;
  let dbValue = value;
  if (key.endsWith('__gte')) {
    const lastIndex = key.lastIndexOf('__gte');
    dbParam = key.slice(0, lastIndex);
    const tempValue = toNumber(value);
    dbValue = {
      $gte: isNumber(tempValue) ? tempValue : value,
    };
  }
  if (key.endsWith('__lte')) {
    const lastIndex = key.lastIndexOf('__lte');
    dbParam = key.slice(0, lastIndex);
    const tempValue = toNumber(value);
    dbValue = {
      $lte: isNumber(tempValue) ? tempValue : value,
    };
  }
  if (key.endsWith('__gt')) {
    const lastIndex = key.lastIndexOf('__gt');
    dbParam = key.slice(0, lastIndex);
    const tempValue = toNumber(value);
    dbValue = {
      $gt: isNumber(tempValue) ? tempValue : value,
    };
  }
  if (key.endsWith('__lt')) {
    const lastIndex = key.lastIndexOf('__lt');
    dbParam = key.slice(0, lastIndex);
    const tempValue = toNumber(value);
    dbValue = {
      $lt: isNumber(tempValue) ? tempValue : value,
    };
  }
  if (key.endsWith('__regex')) {
    const lastIndex = key.lastIndexOf('__regex');
    dbParam = key.slice(0, lastIndex);
    dbValue = {
      $regex: value,
    };
  }
  if (key.endsWith('__exists')) {
    const lastIndex = key.lastIndexOf('__exists');
    dbParam = key.slice(0, lastIndex);
    dbValue = {
      $exists: value.toLowerCase() === 'true',
    };
  }
  if (key.endsWith('__exact')) {
    const lastIndex = key.lastIndexOf('__exact');
    dbParam = key.slice(0, lastIndex);
    if (isArray(dbValue)) {
      dbValue = {
        $size: value.length,
        $all: value,
      };
    }
  }
  if (key.endsWith('__in')) {
    const lastIndex = key.lastIndexOf('__in');
    dbParam = key.slice(0, lastIndex);
    if (isArray(dbValue)) {
      dbValue = {
        $in: value,
      };
    }
  }
  return {
    key,
    value,
    dbParam,
    dbValue,
  };
};

export const parseQueryParamFilterToDBQuery = (
  queryParamFilter: QueryParamFilter,
): any => {
  const andQueries = queryParamFilter.andQueries ?? [];
  const orQueries = queryParamFilter.orQueries ?? [];

  const dbQuery = {
    $and: [],
  };

  andQueries.forEach(query => {
    const queryKeys = Object.keys(query);
    const updatedQuery = queryKeys.reduce((tillNow, key) => {
      const { dbParam, dbValue } = getDBQuery(key, query[key]);
      tillNow[dbParam] = dbValue;
      return tillNow;
    }, {});
    dbQuery.$and.push(updatedQuery);
  });

  orQueries.forEach(orQuery => {
    const updatedOrQuery = [];
    orQuery.forEach(query => {
      const queryKeys = Object.keys(query);
      const updatedQuery = queryKeys.reduce((tillNow, key) => {
        const { dbParam, dbValue } = getDBQuery(key, query[key]);
        tillNow[dbParam] = dbValue;
        return tillNow;
      }, {});
      updatedOrQuery.push(updatedQuery);
    });
    dbQuery.$and.push({ $or: updatedOrQuery });
  });

  return dbQuery;
};
