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
    index, from, size, query
  } = params;
  console.log('query is ' + query, params)

  const esQuery = {
    index,
    from: from || 0,
    size: size || 24,
    track_total_hits: true
  };
  if (query) esQuery.query = 
    {
      match: {
        title: query
      }
    };
  else esQuery.query =
    {
      match_all: {}
    };

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

  const client = getClient();
  const response = await client.search(esQuery);
  console.log(response.aggregations)

  const options = getResponseOptions(response)

  if (true) {
    return { query: esQuery, data: response.hits.hits, options }
  }
}

function getResponseOptions (response) {
  const options = {}
  /*
  if (response?.aggregations) {
    for (const [key, agg] in Object.entries(response.aggregations)) {
      if (agg?.buckets && agg.buckets.length) {
        options[key] = agg.buckets
      }
    }
  }
  */
  Object.keys(response.aggregations).forEach(n => {
    const agg = response.aggregations[n]
    if (agg.buckets && agg.buckets.length) {
      options[n] = agg.buckets
    }
  })
  return options
};

/*

async function deleteIndex (index) {
  if (await existsIndex(index)) await client.indices.delete({index})
  console.log('deleted index ' + index)
}

async function createIndex(index, deleteIfExists = true) {
  if (deleteIfExists) await deleteIndex(index)
  await client.indices.create({
    index,
    body: indices[index]
  })
  console.log('created index ' + index)
}



function existsIndex(index) {
  return client.indices.exists({index})
}






async function bulk(index, documents, idFieldName = 'id', method = 'index') {
  let operations = null
  if (method === 'index') {
    console.log('bulk inserting ' + documents.length)
    operations = documents.flatMap(doc => [
      {
        index: {
          _index: index,
          ...(
            idFieldName in doc &&
            (doc[idFieldName] || doc[idFieldName] === 0) &&
            { _id: doc[idFieldName] }
          )
        }
      },
      doc
    ])
  } else if (method === 'update') {
    console.log('bulk updating ' + documents.length)
    operations = documents.flatMap(doc => [
      {
        [method]: {
          _index: index,
          ...(
            idFieldName in doc &&
            (doc[idFieldName] || doc[idFieldName] === 0) &&
            { _id: doc[idFieldName] }
          )
        }
      },
      {
        doc,
        doc_as_upsert: true
      }
    ])
  }
  const bulkResponse = await client.bulk({ refresh: true, operations })
  console.log('inserted ' + await countIndex(index), JSON.stringify(bulkResponse, null, 2));
  //console.log('bulk ' + documents.length + ' total: ' + await countIndex(index));
}

export async function importData(index, dataFilename) {
  const bulkLimit = 100;
  await createIndex(index)
  const inputFile = await fs.open(dataFilename);
  let documents = [];
  for await (const line of inputFile.readLines()) {
    const obj = JSON.parse(line);
    if (!obj?.id) continue;
    documents.push(obj);
    if (documents.length >= bulkLimit) {
      await bulk(index, documents, 'id', 'index');
      documents = [];
      await snooze(1);
    }
  }
  if (documents.length > 0) {
    await bulk(index, documents);
  }
  return;
}
*/