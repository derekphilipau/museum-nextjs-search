'use strict'
import {readFileSync} from 'fs'
import {Client} from '@elastic/elasticsearch';
import { indicesMeta } from "@/util/search.js";

const SEARCH_PAGE_SIZE = 24;
const SEARCH_AGG_SIZE = 20;
const OPTIONS_PAGE_SIZE = 20;
const SIMILAR_PAGE_SIZE = 24;
const UNKNOWN_CONSTITUENT = 'Unknown';

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
  const {
    index, p, q,
    primaryConstituent, classification, medium, period, dynasty,
    museumLocation, section, geographicalLocations, collections
  } = params;
  const size = SEARCH_PAGE_SIZE;

  const esQuery = {
    index,
    query: { bool: { must: {} } },
    from: (p - 1) * size || 0,
    size,
    track_total_hits: true
  };
  if (q) esQuery.query.bool.must = 
    {
      match: {
        title: q
      }
    };
  else esQuery.query.bool.must =
    {
      match_all: {}
    };

  const filters = [];
  if (primaryConstituent) filters.push({ name: 'primaryConstituent', value: primaryConstituent });
  if (classification) filters.push({ name: 'classification', value: classification });
  if (medium) filters.push({ name: 'medium', value: medium });
  if (period) filters.push({ name: 'period', value: period });
  if (dynasty) filters.push({ name: 'dynasty', value: dynasty });
  if (museumLocation) filters.push({ name: 'museumLocation', value: museumLocation });
  if (section) filters.push({ name: 'section', value: section });
  if (geographicalLocations) filters.push({ name: 'geographicalLocations', value: geographicalLocations });
  if (collections) filters.push({ name: 'collections', value: collections });

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
  console.log(esQuery)

  const client = getClient();
  const response = await client.search(esQuery);
  console.log(response)

  const options = getResponseOptions(response)

  const count = response?.hits?.total?.value || 0;
  const metadata = { 
    count,
    pages: Math.ceil(count/size)
  }

  const test = Math.floor(Math.random() * 640000);

  const data = response.hits.hits.map(h => h._source)

  return { query: esQuery, data, options, metadata, test: test }
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

export async function options(params) {
  const {
    index, field, q
  } = params;

  const size = OPTIONS_PAGE_SIZE;

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
  console.log(JSON.stringify(response, null, 2))
  if (response.aggregations[field].buckets) {
    return response.aggregations[field].buckets
  } else {
    return []
  }
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
  addShouldTerms(document, esQuery, 'classification', 1)
  addShouldTerms(document, esQuery, 'medium', 1)
  //addShouldTerms(esQuery, 'artistRole', document, 1)
  addShouldTerms(document, esQuery, 'geographicalLocations', 0.5)
console.log(JSON.stringify(esQuery))
  const client = getClient();
  const response = await client.search(esQuery)
  if (!response?.hits?.hits?.length) {
    return []
  }
  return response.hits.hits.map(h => h._source)
}

function addShouldTerms (document, esQuery, name, boost) {
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