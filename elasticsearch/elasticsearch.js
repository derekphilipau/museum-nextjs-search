'use strict'
import config from 'config';
import fs from 'fs/promises';
import {readFileSync} from 'fs'
import {Client} from '@elastic/elasticsearch';

import collections from './indices/collections.json' assert { type: 'json' };

const indices = {
  collections: collections,
};

const certificateFile = './config/http_ca.crt';

const client = getClient();

const snooze = s => new Promise(resolve => setTimeout(resolve, (s * 1000)))

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

function getClient() {
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

async function countIndex(index) {
  const res = await client.count({
    index,
    body: {
      query: { match_all: {} }
    }
  });
  return res?.count;
}

function existsIndex(index) {
  return client.indices.exists({index})
}

async function bulk(index, documents, idFieldName, method = 'index') {
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

export async function importData(index, dataFilename, idFieldName) {
  const bulkLimit = config.get('elasticsearch.bulkLimit');
  await createIndex(index)
  const inputFile = await fs.open(dataFilename);
  let documents = [];
  for await (const line of inputFile.readLines()) {
    const obj = JSON.parse(line);
    //if (!obj?.id) continue;
    documents.push(obj);
    if (documents.length >= bulkLimit) {
      await bulk(index, documents, idFieldName, 'index');
      documents = [];
      await snooze(2);
    }
  }
  if (documents.length > 0) {
    await bulk(index, documents);
  }
  return;
}


export async function options(params, size) {
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
  console.log(JSON.stringify(response, null, 2))
  if (response.aggregations[field].buckets) {
    return response.aggregations[field].buckets
  } else {
    return []
  }
}