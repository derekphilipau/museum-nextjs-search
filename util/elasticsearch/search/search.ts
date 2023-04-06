'use strict';

import { indicesMeta } from '@/util/elasticsearch/indicesMeta';
import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { AggOptions } from '@/types/aggOptions';
import type {
  ApiResponseSearch,
  ApiResponseSearchMetadata,
} from '@/types/apiResponseSearch';
import type { BaseDocument } from '@/types/baseDocument';
import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import type { Term } from '@/types/term';
import { getClient } from '../client';
import { getTerm, terms } from './terms';

const DEFAULT_SEARCH_PAGE_SIZE = 24; // 24 results per page
const SEARCH_AGG_SIZE = 20; // 20 results per aggregation
const MIN_SEARCH_QUERY_LENGTH = 3; // Minimum length of search query

/**
 * Search for documents in one or more indices
 *
 * @param params Search parameters
 * @returns Elasticsearch search response
 */
export async function search(params: any): Promise<ApiResponseSearch> {
  if (params.index === 'collections') {
    return searchCollections(params);
  }

  let { index, p, size, q } = params;

  // Defaults for params:
  index = index !== 'all' ? index : ['collections', 'content', 'archives'];
  size = size || DEFAULT_SEARCH_PAGE_SIZE;
  p = p || 1;

  const esQuery: T.SearchRequest = {
    index,
    query: { bool: { must: {} } },
    from: (p - 1) * size || 0,
    size,
    track_total_hits: true,
  };
  if (q && esQuery?.query?.bool) {
    esQuery.query.bool.must = [
      {
        multi_match: {
          query: q,
          type: 'best_fields',
          operator: 'and',
          fields: [
            'boostedKeywords^20',
            'primaryConstituent^4',
            'title^2',
            'keywords^2',
            'description',
            'searchText',
          ],
        },
      },
    ];
  } else if (esQuery?.query?.bool) {
    esQuery.query.bool.must = [
      {
        match_all: {},
      },
    ];
    if (index !== 'content') esQuery.sort = [{ startDate: 'desc' }];
  }

  if (index === 'all') {
    esQuery.indices_boost = [
      { content: 6 },
      { collections: 3 },
      { archives: 1 },
    ];
  }

  addQueryBoolFilterTerms(esQuery, index, params);
  addQueryAggs(esQuery, index);

  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);

  const options = getResponseOptions(response);
  const metadata = getResponseMetadata(response, size);
  const data = response.hits.hits.map((h) => h._source as BaseDocument);
  const res: ApiResponseSearch = { query: esQuery, data, options, metadata };
  const qt = await getSearchQueryTerms(q, p, client);
  if (qt !== undefined && qt?.length > 0) res.terms = qt;
  return res;
}

export async function searchCollections(
  params: any
): Promise<ApiResponseSearch> {
  let { index, p, size, q, color } = params;

  // Defaults for missing params:
  index = 'collections';
  size = size || DEFAULT_SEARCH_PAGE_SIZE;
  p = p || 1;

  const esQuery: T.SearchRequest = {
    index,
    query: { bool: { must: {} } },
    from: (p - 1) * size || 0,
    size,
    track_total_hits: true,
  };
  if (q && esQuery?.query?.bool) {
    esQuery.query.bool.must = [
      {
        multi_match: {
          query: q,
          type: 'best_fields',
          operator: 'and',
          fields: [
            'boostedKeywords^20',
            'constituents^4', // TODO
            'title^2',
            'keywords^2',
            'description',
            'searchText',
            'accessionNumber',
          ],
        },
      },
    ];
  } else if (esQuery?.query?.bool) {
    esQuery.query.bool.must = [
      {
        match_all: {},
      },
    ];
    esQuery.sort = [{ startDate: 'desc' }];
  }

  if (color) {
    //esQuery.sort = [{ dominantColorsHsl: 'desc' }];
    //"dominantColorsHsl":[[0.21296296296296272
  }

  addQueryBoolDateRange(esQuery, params);
  addQueryBoolFilterTerms(esQuery, index, params);
  addQueryAggs(esQuery, index);

  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);

  const options = getResponseOptions(response);
  const metadata = getResponseMetadata(response, size);
  const data = response.hits.hits.map(
    (h) => h._source as CollectionObjectDocument
  );
  const res: ApiResponseSearch = { query: esQuery, data, options, metadata };
  const qt = await getSearchQueryTerms(q, p, client);
  if (qt !== undefined && qt?.length > 0) res.terms = qt;
  const term = await getFilterTerm(index, params, client);
  if (term !== undefined) res.filters = [term];
  return res;
}

/**
 * Get the options/buckets for each agg in the response
 *
 * @param response The response from the ES search
 * @returns Array of aggregations with options/buckets
 */
function getResponseOptions(response: T.SearchTemplateResponse): AggOptions {
  const options: AggOptions = {};
  if (response?.aggregations) {
    Object.keys(response?.aggregations).forEach((field) => {
      if (response.aggregations?.[field] !== undefined) {
        const aggAgg: T.AggregationsAggregate = response.aggregations?.[field];
        if ('buckets' in aggAgg && aggAgg?.buckets)
          options[field] = aggAgg.buckets;
      }
    });
  }
  return options;
}

/**
 * Get the total number of results and the number of pages
 *
 * @param response The response from the ES search
 * @param size The number of results per page
 * @returns Object with the total number of results and the number of pages
 */
function getResponseMetadata(
  response: T.SearchTemplateResponse,
  size: number
): ApiResponseSearchMetadata {
  let count = response?.hits?.total || 0; // Returns either number or SearchTotalHits
  if (typeof count !== 'number') count = count.value;
  return {
    count,
    pages: Math.ceil(count / size),
  };
}

/**
 * If there was a search query, search for matching terms:
 *
 * @param q Search query
 * @param p Page number
 * @param client ES client
 * @returns Array of matching terms
 */
async function getSearchQueryTerms(
  q: string,
  p: number,
  client: Client
): Promise<Term[] | undefined> {
  if (q?.length && q?.length > MIN_SEARCH_QUERY_LENGTH && p === 1) {
    return await terms(q, undefined, client);
  }
}

async function getFilterTerm(
  indexName: string,
  params: any,
  client: Client
): Promise<Term | undefined> {
  if (Array.isArray(indexName)) return; // TODO: Remove when we implement cross-index filters
  if (indicesMeta[indexName]?.filters?.length > 0) {
    for (const filter of indicesMeta[indexName].filters) {
      if (params?.[filter] && filter === 'primaryConstituent') {
        // TODO: Only returns primaryConstituent filter term
        const response = await getTerm(filter, params?.[filter], client);
        return response?.data as Term;
      }
    }
  }
}

/**
 * Currently only supports year ranges
 *
 * @param esQuery The ES query to modify in place
 * @param params The search params
 */
function addQueryBoolDateRange(esQuery: any, params: any) {
  console.log(params?.startDate, params?.endDate);
  const ranges: T.QueryDslQueryContainer[] = [];
  if (params?.startDate) {
    ranges.push({
      range: {
        startDate: {
          gte: params.startDate,
        },
      },
    });
  }
  if (params?.endDate) {
    ranges.push({
      range: {
        endDate: {
          lte: params.endDate,
        },
      },
    });
  }
  if (ranges.length > 0) {
    esQuery.query ??= {};
    esQuery.query.bool ??= {};
    esQuery.query.bool.filter ??= [];
    esQuery.query.bool.filter.push(...ranges);
  }
}

function addQueryBoolFilterTerms(esQuery: any, indexName: any, params: any) {
  if (Array.isArray(indexName)) return;
  if (indicesMeta[indexName]?.filters?.length > 0) {
    for (const filter of indicesMeta[indexName].filters) {
      if (filter === 'onView' && params?.[filter] === 'true')
        addQueryBoolMustNotFilter(
          esQuery,
          'museumLocation',
          'This item is not on view'
        );
      else if (filter === 'hasPhoto' && params?.[filter] === 'true')
        addQueryBoolFilterExists(esQuery, 'image');
      else if (filter === 'isUnrestricted' && params?.[filter] === 'true')
        addQueryBoolFilterTerm(esQuery, 'copyrightRestricted', false);
      else addQueryBoolFilterTerm(esQuery, filter, params?.[filter]);
    }
  }
}

/**
 * Add a term to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @param value   The value to filter on
 * @returns  Void.  The ES Query is modified in place
 */
function addQueryBoolFilterTerm(
  esQuery: any,
  name: string,
  value: string | boolean | number | undefined
): void {
  if (!value) return;
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.filter ??= [];
  esQuery.query.bool.filter.push({
    term: {
      [name]: value,
    },
  });
}

/**
 * Add an exists clause to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @returns  Void.  The ES Query is modified in place
 */
function addQueryBoolFilterExists(esQuery: any, name: string): void {
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.filter ??= [];
  esQuery.query.bool.filter.push({
    exists: {
      field: name,
    },
  });
}

/**
 * Add a term to a bool must not section of query
 *
 * @param esQuery The ES query
 * @param name  The name of the field that must exist
 * @returns  Void.  The ES Query is modified in place
 */
function addQueryBoolMustNotFilter(
  esQuery: any,
  name: string,
  value: string
): void {
  if (!value) return;
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.must_not ??= [];
  esQuery.query.bool.must_not.push({
    term: {
      [name]: value,
    },
  });
}

function addQueryAggs(esQuery: any, indexName: string | string[] | undefined) {
  if (indexName === undefined || Array.isArray(indexName)) return;
  if (indicesMeta[indexName]?.aggs?.length > 0) {
    const aggs = {};
    for (const aggName of indicesMeta[indexName].aggs) {
      aggs[aggName] = {
        terms: {
          field: aggName,
          size: SEARCH_AGG_SIZE,
        },
      };
    }
    esQuery.aggs = aggs;
  }
}
