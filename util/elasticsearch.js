'use strict'
import { readFileSync } from 'fs'
import { Client } from '@elastic/elasticsearch';
import { indicesMeta } from "@/util/search.js";

const DEFAULT_SEARCH_PAGE_SIZE = 24;
const SEARCH_AGG_SIZE = 20;
const OPTIONS_PAGE_SIZE = 20;
const TERMS_PAGE_SIZE = 12;
const SIMILAR_PAGE_SIZE = 24;
const UNKNOWN_CONSTITUENT = 'Unknown';

/*
function getClient() {
  const ca = readFileSync('./secrets/http_ca.crt');
  const node = `https://localhost:9200`;
  const clientSettings = {
    node,
    auth: {
      apiKey: 'RkJUcU00WUJxWklLdlp3ZVlqOVY6aG1xc3VNMXVTMUt1MkJPQzNwSzVmQQ=='
    },
    tls: {
      ca,
      rejectUnauthorized: false
    }
  }
  return new Client(clientSettings);
}
*/

export function getClient() {
  const clientSettings = {
    cloud: {
      id: 'elastic-brooklyn-museum:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ5ZDhiNWQ2NDM0NTA0ODgwOGE1MGVjZDViYzhjM2QwMSRjNmE2M2IwMmE3NDQ0YzU1YWU2YTg3YjI2ZTU5MzZmMg==',
    },
    auth: {
      username: 'elastic',
      password: 'pTsgwkbpVyDFUGYgWplDIJsl',
    }
  }
  return new Client(clientSettings);
}

async function countIndex(index, client) {
  try {
    const res = await client.count({
      index,
      body: {
        query: { match_all: {} }
      }
    });
    return res?.count;
  } catch (error) {
    console.log('countIndex error', error)
  }
}

export async function getDocument(index, id) {
  const esQuery = {
    index,
    query: {
      match: {
        id
      }
    }
  };

  const client = getClient();
  const response = await client.search(esQuery);
  return { query: esQuery, data: response?.hits?.hits[0]?._source }
}

export async function search(params) {

  if (params.index === 'collections') {
    return searchCollections(params);
  }

  let {
    index, p, size, q
  } = params;

  index = index === 'content' ? 'content' : ['collections', 'content'];

  // Defaults for missing params:
  size = size || DEFAULT_SEARCH_PAGE_SIZE;
  p = p || 1;

  const esQuery = {
    index,
    query: { bool: { must: {} } },
    from: (p - 1) * size || 0,
    size,
    track_total_hits: true
  };
  if (q) {
    esQuery.query.bool.must =
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
          'searchText'
        ]
      }
    };
  }
  else {
    esQuery.query.bool.must =
    {
      match_all: {}
    };
    /*
    esQuery.sort = [
      { startDate: 'desc' }
    ];
    */
  }

  if (index !== 'content') {
    esQuery.indices_boost = [
      { content: 4 },
      { collections: 1 }
    ]  
  }

  const client = getClient();
  const response = await client.search(esQuery);

  const options = getResponseOptions(response)

  const count = response?.hits?.total?.value || 0;
  const metadata = {
    count,
    pages: Math.ceil(count / size)
  }
  const data = response.hits.hits.map(h => h._source)
  const res = { query: esQuery, data, options, metadata }
  if (q?.length > 3 && p === 1) {
    const t = await terms(q, size = TERMS_PAGE_SIZE, client);
    res.terms = t;
  }
  return res
}

export async function searchCollections(params) {
  let {
    index, p, size, q,
    isUnrestricted, hasPhoto, onView,
    primaryConstituent, classification, medium, period, dynasty,
    museumLocation, section, geographicalLocations, exhibitions, collections
  } = params;

  // Coerce boolean vars
  isUnrestricted = isUnrestricted === 'true';
  hasPhoto = hasPhoto === 'true';
  onView = onView === 'true';

  // Defaults for missing params:
  index = 'collections';
  size = size || DEFAULT_SEARCH_PAGE_SIZE;
  p = p || 1;


  const esQuery = {
    index,
    query: { bool: { must: {} } },
    from: (p - 1) * size || 0,
    size,
    sort: [
      { startDate: 'desc' }
    ],
    track_total_hits: true
  };
  if (q) {
    esQuery.query.bool.must =
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
          'accessionNumber'
        ]
      }
    };
  }
  else {
    esQuery.query.bool.must =
    {
      match_all: {}
    };
    esQuery.sort = [
      { startDate: 'desc' }
    ];
  }


  const filters = [];
  if (primaryConstituent) filters.push({ name: 'primaryConstituent', value: primaryConstituent });
  if (classification) filters.push({ name: 'classification', value: classification });
  if (medium) filters.push({ name: 'medium', value: medium });
  if (period) filters.push({ name: 'period', value: period });
  if (dynasty) filters.push({ name: 'dynasty', value: dynasty });
  if (museumLocation) filters.push({ name: 'museumLocation', value: museumLocation });
  if (section) filters.push({ name: 'section', value: section });
  if (geographicalLocations) filters.push({ name: 'geographicalLocations', value: geographicalLocations });
  if (exhibitions) filters.push({ name: 'exhibitions', value: exhibitions });
  if (collections) filters.push({ name: 'collections', value: collections });
  if (isUnrestricted) filters.push({ name: 'copyrightRestricted', value: false });


  if (filters.length > 0) {
    esQuery.query.bool.filter = [];
    for (const filter of filters) {
      esQuery.query.bool.filter.push({
        term: {
          [filter.name]: filter.value,
        }
      })
    }
  }

  if (hasPhoto) {
    if (!(esQuery.query.bool?.filter?.length > 0)) esQuery.query.bool.filter = [];
    esQuery.query.bool.filter.push({
      exists: {
        field: 'image'
      }
    });
  }

  if (onView) {
    esQuery.query.bool.must_not = {
      term: {
        museumLocation: 'This item is not on view'
      }
    };
  }

  if (indicesMeta[index]?.aggs?.length > 0) {
    const aggs = {}
    for (const agg of indicesMeta[index].aggs) {
      aggs[agg.name] = {
        terms: {
          field: agg.name,
          size: SEARCH_AGG_SIZE
        }
      }
    }
    esQuery.aggs = aggs;
  }

  const client = getClient();
  const response = await client.search(esQuery);

  const options = getResponseOptions(response)

  const count = response?.hits?.total?.value || 0;
  const metadata = {
    count,
    pages: Math.ceil(count / size)
  }

  const data = response.hits.hits.map(h => h._source);
  const res = { query: esQuery, data, options, metadata };
  if (q?.length > 3 && p === 1) {
    const t = await terms(q, size = TERMS_PAGE_SIZE, client);
    res.terms = t;
  }
  return res;
}

function getResponseOptions(response) {
  const options = {}
  if (response?.aggregations) {
    Object.keys(response?.aggregations).forEach(n => {
      const agg = response.aggregations[n]
      if (agg.buckets && agg.buckets.length) {
        options[n] = agg.buckets
      }
    })
  }
  return options
};

export async function options(params, size = OPTIONS_PAGE_SIZE) {
  const {
    index, field, q
  } = params;

  if (!index || !field) { return }

  const request = {
    index,
    size: 0,
    aggs: {
      [field]: {
        terms: {
          field,
          size
        }
      }
    }
  }

  if (q) {
    request.query = {
      wildcard: {
        [field]: {
          value: '*' + q + '*',
          case_insensitive: true
        }
      }
    }
  }

  const client = getClient();
  const response = await client.search(request)

  if (response.aggregations[field].buckets) {
    return response.aggregations[field].buckets
  } else {
    return []
  }
}

export async function terms(query, size = TERMS_PAGE_SIZE, client = null) {
  const request = {
    index: 'terms',
    query: {
      match: {
        value: {
          query,
          fuzziness: 'AUTO'
        }
      }
    },
    from: 0,
    size,
  }

  if (!client) client = getClient();
  const response = await client.search(request)

  return response.hits.hits.map(h => h._source)
}

export async function similar(id) {
  const docResponse = await getDocument('collections', id);
  const document = docResponse?.data;
  if (!document) return;

  const esQuery = {
    index: 'collections',
    query: {
      bool: {
        must_not: {
          term: {
            id: document.id
          }
        },
        must: {
          exists: {
            field: 'image'
          }
        }
      }
    },
    from: 0,
    size: SIMILAR_PAGE_SIZE
  }

  if (
    document.primaryConstituent
    && document.primaryConstituent !== UNKNOWN_CONSTITUENT
  ) {
    addShouldTerms(document, esQuery, 'primaryConstituent', 4)
  }

  //addShouldTerms(esQuery, 'style', document.style, 3.5)
  //addShouldTerms(esQuery, 'movement', document.movement, 3)
  //addShouldTerms(esQuery, 'culture', document.culture, 3)
  addShouldTerms(document, esQuery, 'dynasty', 2)
  //addShouldTerms(esQuery, 'reign', document.reign, 2)
  addShouldTerms(document, esQuery, 'period', 2)
  addShouldTerms(document, esQuery, 'classification', 1.5)
  addShouldTerms(document, esQuery, 'medium', 1)
  addShouldTerms(document, esQuery, 'collections', 1)
  //addShouldTerms(esQuery, 'artistRole', document, 1)
  addShouldTerms(document, esQuery, 'exhibitions', 1)
  addShouldTerms(document, esQuery, 'geographicalLocations', 0.5)

  const client = getClient();
  const response = await client.search(esQuery)
  if (!response?.hits?.hits?.length) {
    return []
  }
  return response.hits.hits.map(h => h._source)
}

function addShouldTerms(document, esQuery, name, boost) {
  if (!(name in document)) return;
  let value = document[name];
  if (!(value?.length > 0)) return;
  if (!Array.isArray(value)) value = [value];
  if (!('query' in esQuery)) esQuery.query = {};
  if (!('bool' in esQuery.query)) esQuery.query.bool = {};
  if (!('should' in esQuery.query.bool)) esQuery.query.bool.should = [];

  esQuery.query.bool.should.push({
    terms: {
      [name]: value,
      boost
    }
  })
}