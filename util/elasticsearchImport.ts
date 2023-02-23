import * as fs from 'fs';
import * as readline from 'node:readline';
import { getClient } from './elasticsearch';
import { collections, content, terms } from './elasticsearchIndices';
import { Client } from '@elastic/elasticsearch';

const ERR_CLIENT = 'Cannot connect to Elasticsearch.';
const ELASTICSEARCH_BULK_LIMIT = 100;

const indices = {
  collections,
  content,
  terms
};

const snooze = s => new Promise(resolve => setTimeout(resolve, (s * 1000)))

/**
 * Check if a given index already exists in Elasticsearch.
 */
async function existsIndex(client: Client, indexName: string): Promise<boolean> {
  return await client.indices.exists({index: indexName}) ? true : false;
}

/**
 * Delete an Elasticsearch index.
 */
async function deleteIndex(client: Client, indexName: string) {
  if (await existsIndex(client, indexName)) await client.indices.delete({index: indexName});
}

/**
 * Create an Elasticsearch index.
 */
 async function createIndex(client: Client, indexName: string, deleteIfExists = true) {
  if (deleteIfExists) await deleteIndex(client, indexName);
  await client.indices.create({
    index: indexName,
    body: indices[indexName]
  });
}

/**
 * Count the number of documents in an index.
 */
async function countIndex(client: Client, indexName: string) {
  const res = await client.count({
    index: indexName,
    body: { query: { match_all: {} } }
  });
  return res?.count;
}

/**
 * Either insert or update the documents.
 */
async function bulk(client: Client, indexName: string, documents: any, idFieldName: string, method = 'index') {
  if (client === undefined) throw new Error(ERR_CLIENT);
  const operations = documents.flatMap(doc => [
    {
      [method]: {
        _index: indexName,
        ...(
          idFieldName in doc &&
          (doc[idFieldName] || doc[idFieldName] === 0) &&
          { _id: doc[idFieldName] }
        )
      }
    },
    ...(method === 'update' ? [{ doc, doc_as_upsert: true }] : [doc])
  ]);
  const bulkResponse = await client.bulk({ refresh: true, operations })
  console.log('inserted ' + await countIndex(client, indexName), JSON.stringify(bulkResponse, null, 2));
}

/**
 * Import data from a jsonl file (one JSON object per row, no endline commas)
 */
export async function importData(indexName: string, dataFilename: string, idFieldName: string) {
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);
  await createIndex(client, indexName);
  const fileStream = fs.createReadStream(dataFilename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let documents:any[] = [];
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (obj !== undefined) documents.push(obj);
    if (documents.length >= ELASTICSEARCH_BULK_LIMIT) {
      await bulk(client, indexName, documents, idFieldName);
      documents = [];
      await snooze(2);
    }
  }
  if (documents.length > 0) {
    await bulk(client, indexName, documents, idFieldName);
  }
}
