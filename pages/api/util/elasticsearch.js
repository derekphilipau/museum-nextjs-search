'use strict'
import {readFileSync} from 'fs'
import {Client} from '@elastic/elasticsearch';

const indexAggregations = {
  collections: [
    { name: 'primaryConstituent', displayName: 'Maker' },
    { name: 'classification', displayName: 'Classification' },
    { name: 'medium', displayName: 'Medium' },
    { name: 'period', displayName: 'Period' },
    { name: 'dynasty', displayName: 'Dynasty' },
    { name: 'museumLocation', displayName: 'Museum Location' },
    { name: 'section', displayName: 'Section' },
  ]
}

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
    index, p, q, classification, medium
  } = params;
  const size = 24;
  console.log('q is ' + q, params)

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
  if (classification) {
    filters.push({ name: 'classification', value: classification })
  }
  if (medium) {
    filters.push({ name: 'medium', value: medium })
  }
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

  if (indexAggregations[index]?.length > 0) {
    const aggs = {}
    for (const agg of indexAggregations[index]) {
      aggs[agg.name] = {
        terms: {
          field: agg.name,
          size: 20
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

  return { query: esQuery, data: response.hits.hits, options, metadata, test: test }
}

function getResponseOptions (response) {
  const options = {}
  Object.keys(response.aggregations).forEach(n => {
    const agg = response.aggregations[n]
    if (agg.buckets && agg.buckets.length) {
      options[n] = agg.buckets
    }
  })
  return options
};
