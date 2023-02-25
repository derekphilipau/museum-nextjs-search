'use strict';

import { readFileSync } from 'fs';
import { indicesMeta } from '@/util/elasticsearch/indicesMeta';
import { getBooleanValue } from '@/util/various';
import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiResponseDocument } from '@/types/apiResponseDocument';
import type { ApiResponseSearch } from '@/types/apiResponseSearch';

const DEFAULT_SEARCH_PAGE_SIZE = 24; // 24 results per page
const SEARCH_AGG_SIZE = 20; // 20 results per aggregation
const OPTIONS_PAGE_SIZE = 20; // 20 results per aggregation options search
const TERMS_PAGE_SIZE = 12; // 12 results per aggregation terms search
const SIMILAR_PAGE_SIZE = 24; // 24 results per similar search
const MIN_SEARCH_QUERY_LENGTH = 3; // Minimum length of search query
const UNKNOWN_CONSTITUENT = 'Unknown'; // Default string for unknown constituent in dataset

/**
 * Get an Elasticsearch client
 *
 * @returns Elasticsearch client
 */
export function getClient(): Client | undefined {
  if (process.env.ELASTICSEARCH_USE_CLOUD === 'true') {
    const id = process.env.ELASTICSEARCH_CLOUD_ID;
    const username = process.env.ELASTICSEARCH_CLOUD_USERNAME;
    const password = process.env.ELASTICSEARCH_CLOUD_PASSWORD;
    if (!id || !username || !password) return undefined;
    const clientSettings = {
      cloud: { id },
      auth: { username, password },
    };
    return new Client(clientSettings);
  }

  const caFile = process.env.ELASTICSEARCH_CA_FILE;
  const node = `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`;
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  if (!caFile || !node || !apiKey) return undefined;
  const ca = readFileSync(caFile);
  const clientSettings = {
    node,
    auth: {
      apiKey,
    },
    tls: {
      ca,
      rejectUnauthorized: false,
    },
  };
  return new Client(clientSettings);
}

/**
 * Get a document by Elasticsearch id
 *
 * @param index Index to search
 * @param id ID of document to search for
 * @returns Elasticsearch Document
 */
export async function getDocument(
  index: string,
  id: number
): Promise<ApiResponseDocument> {
  const esQuery = {
    index,
    query: {
      match: {
        id,
      },
    },
  };
  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const data = response?.hits?.hits[0]?._source;
  const apiResponse: ApiResponseDocument = { query: esQuery, data };
  if (index === 'collections') {
    apiResponse.similar = await similarCollectionObjects(data, client);
  }
  return apiResponse;
}

interface SearchParams {
  index?: string | string[]; // Indices to search
  p?: number; // Page number (1 is first page)
  size?: number; // Number of results per page
  q?: string; // Search query
  isUnrestricted?: string | boolean; // Is copyright unrestricted?
  hasPhoto?: string | boolean; // Has a photo?
  onView?: string | boolean; // Is on view?
  primaryConstituent?: string; // Primary constituent
  classification?: string; // e.g. Print, Sculpture
  medium?: string; // e.g. Painting, Drawing
  period?: string; // e.g. 19th Century
  dynasty?: string; // e.g. Ming
  museumLocation?: string; // Decorative Art, 19th Century, 4th Floor
  section?: string; // Section, e.g. Middle Kingdom
  primaryGeographicalLocationContinent?: string; // e.g. Africa, Asia
  primaryGeographicalLocationCountry?: string; // e.g. China, Japan
  primaryGeographicalLocation?: string; // e.g. Paris, New York
  exhibitions?: string; // e.g. Ancient Egyptian Art
  collections?: string; // Actually the department, e.g. Decorative Arts
}

/**
 * Search for documents in one or more indices
 *
 * @param params Search parameters
 * @returns Elasticsearch search response
 */
export async function search(params: SearchParams): Promise<ApiResponseSearch> {
  if (params.index === 'collections') {
    return searchCollections(params);
  }

  let { index, p, size, q } = params;

  index = index === 'content' ? 'content' : ['collections', 'content'];

  // Defaults for missing params:
  size = size || DEFAULT_SEARCH_PAGE_SIZE;
  p = p || 1;

  const esQuery: T.SearchRequest = {
    index,
    query: { bool: { must: { match_all: {} } } },
    from: (p - 1) * size || 0,
    size,
    track_total_hits: true,
  };
  if (q && esQuery?.query?.bool) {
    esQuery.query.bool.must = {
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
    };
  }

  if (index !== 'content') {
    esQuery.indices_boost = [{ content: 4 }, { collections: 1 }];
  }

  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);

  const options = getResponseOptions(response);

  let count = 0;
  if (
    typeof response?.hits?.total !== 'number' &&
    response?.hits?.total?.value !== undefined
  )
    count = response?.hits?.total?.value;
  const metadata = {
    count,
    pages: Math.ceil(count / size),
  };
  const data = response.hits.hits.map((h) => h._source);
  const res: ApiResponseSearch = { query: esQuery, data, options, metadata };
  if (q?.length && q?.length > MIN_SEARCH_QUERY_LENGTH && p === 1) {
    const t = await terms(q, (size = TERMS_PAGE_SIZE), client);
    res.terms = t;
  }
  return res;
}

export async function searchCollections(
  params: SearchParams
): Promise<ApiResponseSearch> {
  let {
    index,
    p,
    size,
    q,
    isUnrestricted,
    hasPhoto,
    onView,
    primaryConstituent,
    classification,
    medium,
    period,
    dynasty,
    museumLocation,
    section,
    primaryGeographicalLocationContinent,
    primaryGeographicalLocationCountry,
    primaryGeographicalLocation,
    exhibitions,
    collections,
  } = params;

  // Coerce boolean vars
  isUnrestricted = getBooleanValue(isUnrestricted);
  hasPhoto = getBooleanValue(hasPhoto);
  onView = getBooleanValue(onView);

  // Defaults for missing params:
  index = 'collections';
  size = size || DEFAULT_SEARCH_PAGE_SIZE;
  p = p || 1;

  const esQuery: any = {
    index,
    query: { bool: { must: {} } },
    from: (p - 1) * size || 0,
    size,
    sort: [{ startDate: 'desc' }],
    track_total_hits: true,
  };
  if (q) {
    esQuery.query.bool.must = {
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
    };
  } else {
    esQuery.query.bool.must = {
      match_all: {},
    };
    esQuery.sort = [{ startDate: 'desc' }];
  }

  addQueryBoolFilterTerm(esQuery, 'primaryConstituent', primaryConstituent);
  addQueryBoolFilterTerm(esQuery, 'classification', classification);
  addQueryBoolFilterTerm(esQuery, 'medium', medium);
  addQueryBoolFilterTerm(esQuery, 'period', period);
  addQueryBoolFilterTerm(esQuery, 'dynasty', dynasty);
  addQueryBoolFilterTerm(esQuery, 'museumLocation', museumLocation);
  addQueryBoolFilterTerm(esQuery, 'section', section);
  addQueryBoolFilterTerm(
    esQuery,
    'primaryGeographicalLocationContinent',
    primaryGeographicalLocationContinent
  );
  addQueryBoolFilterTerm(
    esQuery,
    'primaryGeographicalLocationCountry',
    primaryGeographicalLocationCountry
  );
  addQueryBoolFilterTerm(
    esQuery,
    'primaryGeographicalLocation',
    primaryGeographicalLocation
  );
  addQueryBoolFilterTerm(esQuery, 'exhibitions', exhibitions);
  addQueryBoolFilterTerm(esQuery, 'collections', collections);
  addQueryBoolFilterTerm(esQuery, 'isUnrestricted', isUnrestricted);

  if (hasPhoto) addQueryBoolFilterExists(esQuery, 'image');

  if (onView) {
    addQueryBoolMustNotFilter(
      esQuery,
      'museumLocation',
      'This item is not on view'
    );
  }

  if (indicesMeta[index]?.aggs?.length > 0) {
    const aggs = {};
    for (const aggName of indicesMeta[index].aggs) {
      aggs[aggName] = {
        terms: {
          field: aggName,
          size: SEARCH_AGG_SIZE,
        },
      };
    }
    esQuery.aggs = aggs;
  }

  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);

  const options = getResponseOptions(response);

  let count = response?.hits?.total || 0; // Returns either number or SearchTotalHits
  if (typeof count !== 'number') count = count.value;
  const metadata = {
    count,
    pages: Math.ceil(count / size),
  };

  const data = response.hits.hits.map((h) => h._source);
  const res: ApiResponseSearch = { query: esQuery, data, options, metadata };
  if (q && q?.length > MIN_SEARCH_QUERY_LENGTH && p === 1) {
    const t = await terms(q, (size = TERMS_PAGE_SIZE), client);
    res.terms = t;
  }
  return res;
}

/**
 * Get the options/buckets for each agg in the response
 *
 * @param response The response from the ES search
 * @returns Array of aggregations with options/buckets
 */
function getResponseOptions(response) {
  const options = {};
  if (response?.aggregations) {
    Object.keys(response?.aggregations).forEach((n) => {
      const agg = response.aggregations[n];
      if (agg.buckets && agg.buckets.length) {
        options[n] = agg.buckets;
      }
    });
  }
  return options;
}

interface OptionsParams {
  index?: string | string[]; // Indices to search
  field?: string; // Field to get options for
  q?: string; // Query string
}

/**
 * Get options/buckets for a specific field/agg
 * @param params
 * @param size Number of options to return
 * @returns
 */
export async function options(params: OptionsParams, size = OPTIONS_PAGE_SIZE) {
  const { index, field, q } = params;

  if (!index || !field) {
    return;
  }

  const request: any = {
    index,
    size: 0,
    aggs: {
      [field]: {
        terms: {
          field,
          size,
        },
      },
    },
  };

  if (q) {
    request.query = {
      wildcard: {
        [field]: {
          value: '*' + q + '*',
          case_insensitive: true,
        },
      },
    };
  }

  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(request);
  if (response.aggregations?.[field] !== undefined) {
    const aggAgg: T.AggregationsAggregate = response.aggregations?.[field];
    if ('buckets' in aggAgg && aggAgg?.buckets) return aggAgg.buckets;
  }
  return [];
}

/**
 * Get terms for a query. Used for "Did you mean?"
 *
 * @param query The query to search for
 * @param size Number of terms to return
 * @param client The ES client
 * @returns Array of terms
 */
export async function terms(
  query?: string | string[],
  size: number = TERMS_PAGE_SIZE,
  client?: Client
) {
  const request = {
    index: 'terms',
    query: {
      match: {
        value: {
          query,
          fuzziness: 'AUTO',
        },
      },
    },
    from: 0,
    size,
  };

  if (!client) client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(request);

  return response.hits.hits.map((h) => h._source);
}

export async function similarCollectionObjectsById(id) {
  const docResponse = await getDocument('collections', id);
  const document = docResponse?.data;
  if (document) return similarCollectionObjects(document);
}

/**
 * Get similar objects for a given document
 *
 * @param document The document to get similar objects for
 * @param client The ES client
 * @returns Array of similar objects
 */
async function similarCollectionObjects(document?: any, client?: Client) {
  if (!document || !document.id) return [];

  const esQuery = {
    index: 'collections',
    query: {
      bool: {
        must_not: {
          term: {
            id: document.id,
          },
        },
        must: {
          exists: {
            field: 'image',
          },
        },
      },
    },
    from: 0,
    size: SIMILAR_PAGE_SIZE,
  };

  if (
    document.primaryConstituent &&
    document.primaryConstituent !== UNKNOWN_CONSTITUENT
  ) {
    addShouldTerms(document, esQuery, 'primaryConstituent', 4);
  }
  //addShouldTerms(esQuery, 'style', document.style, 3.5)
  //addShouldTerms(esQuery, 'movement', document.movement, 3)
  //addShouldTerms(esQuery, 'culture', document.culture, 3)
  addShouldTerms(document, esQuery, 'dynasty', 2);
  //addShouldTerms(esQuery, 'reign', document.reign, 2)
  addShouldTerms(document, esQuery, 'period', 2);
  addShouldTerms(document, esQuery, 'classification', 1.5);
  addShouldTerms(document, esQuery, 'medium', 1);
  addShouldTerms(document, esQuery, 'collections', 1);
  //addShouldTerms(esQuery, 'artistRole', document, 1)
  addShouldTerms(document, esQuery, 'exhibitions', 1);
  addShouldTerms(document, esQuery, 'primaryGeographicalLocation', 1);

  if (!client) client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  if (!response?.hits?.hits?.length) {
    return [];
  }
  return response.hits.hits.map((h) => h._source);
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
  if (!esQuery?.query) esQuery.query = {};
  if (!esQuery.query?.bool) esQuery.query.bool = {};
  if (!esQuery.query.bool?.filter) esQuery.query.bool.filter = [];
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
  if (!esQuery?.query) esQuery.query = {};
  if (!esQuery.query?.bool) esQuery.query.bool = {};
  if (!esQuery.query.bool?.filter) esQuery.query.bool.filter = [];
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
  if (!esQuery?.query) esQuery.query = {};
  if (!esQuery.query?.bool) esQuery.query.bool = {};
  if (!esQuery.query.bool?.must_not) esQuery.query.bool.must_not = [];
  esQuery.query.bool.must_not.push({
    term: {
      [name]: value,
    },
  });
}

/**
 * Add a should term with boost to query
 *
 * @param document The document from which to get the value
 * @param esQuery The ES query
 * @param name  The name of the field to add to the term query
 * @returns  Void.  The ES Query is modified in place
 */
function addShouldTerms(
  document: any,
  esQuery: any,
  name: string,
  boost: number
) {
  if (!(name in document)) return;
  let value = document[name];
  if (!(value?.length > 0)) return;
  if (!Array.isArray(value)) value = [value];
  if (!esQuery?.query) esQuery.query = {};
  if (!esQuery.query?.bool) esQuery.query.bool = {};
  if (!esQuery.query.bool?.should) esQuery.query.bool.should = [];
  esQuery.query.bool.should.push({
    terms: {
      [name]: value,
      boost,
    },
  });
}
