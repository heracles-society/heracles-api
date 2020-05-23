import { parse } from 'qs';

export interface QueryParamFilter {
  andQueries: any[];
  orQueries: any[][];
}

/**
 * Returns parsed query, broken into top level andQueries and orQueries.
 *
 * Query should be separated by & for AND operations.
 * OR operations are supported by 2 formats:
 * 1. Same parameter like a=2 OR a=3. Query should be in the format of `a=2&a=3`. This translates to `{a:[1, 2]}`
 * 2. Different parameters like a=2 OR b=3. Query should be in the format of `(a=2|b=3)`. This translates to `[{a:2}, {b:3}]`
 *
 * Nested Support:
 * - nested OR queries across parameters are not supported
 * - nested OR queries within parameter are supported
 * - nested AND queries are supported
 *
 * Things to remember:
 * - Each list in the orQueries are to be used to perform AND operations, while
 * individual entries in the list are to be used to perform OR operations.
 *
 *
 * NOTE:
 * since it adds to the confusion, we only ONE depth level of parsing only.
 *
 * @param {string} query
 * @example
 * let query = 'a=1&b=2&(c=3&c=4&d=4|d=5|d=6)&(d=6|e=7)';
 * parseQueryParamFilters(query);
 * returns ==> {
 *  "andQueries":[{"a":"1"},{"b":"2"}],
 *  "orQueries":[
 *    [{"c":["3","4"],"d":"4"},{"d":"5"},{"d":"6"}],
 *    [{"d":"6"},{"e":"7"}]
 *  ]
 * }
 * @returns {QueryParamFilter}
 */
export const parseQueryParamFilters = (query: string): QueryParamFilter => {
  const matches = query.match(/(\([^)]+\))/g);
  const orQueries = [];
  matches?.forEach(match => {
    query = query.replace(match, '');
    const orQuery = [];
    match
      .replace(/[\(\)]/g, '')
      .split('|')
      .map(cleanedMatch => {
        const params = parse(cleanedMatch, { depth: 1 });
        orQuery.push(params);
      });

    orQueries.push(orQuery);
  });

  const parsedAndQueries = parse(query, { depth: 1 });
  delete parsedAndQueries.undefined;
  const andQueries = Object.entries(parsedAndQueries).map(([key, value]) => ({
    [key]: value,
  }));
  return { andQueries, orQueries };
};
