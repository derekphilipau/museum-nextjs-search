import * as fs from 'fs';
import * as readline from 'node:readline';
import { Client } from '@elastic/elasticsearch';

import { archives, collections, content, terms } from './indices';
import { getClient } from './search';

export const ERR_CLIENT = 'Cannot connect to Elasticsearch.';
export const ELASTICSEARCH_BULK_LIMIT = 100;

const indices = {
  collections,
  content,
  archives,
  terms,
};

/**
 * Sleep for a given number of seconds.
 *
 * @param s Number of seconds to sleep.
 * @returns A promise that resolves after the given number of seconds.
 */
export function snooze(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

/**
 * Check if a given index already exists in Elasticsearch.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 * @returns True if the index exists, false otherwise.
 */
async function existsIndex(
  client: Client,
  indexName: string
): Promise<boolean> {
  return (await client.indices.exists({ index: indexName })) ? true : false;
}

/**
 * Delete an Elasticsearch index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 */
async function deleteIndex(client: Client, indexName: string) {
  if (await existsIndex(client, indexName))
    await client.indices.delete({ index: indexName });
}

/**
 * Create an Elasticsearch index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 * @param deleteIfExists Delete the index if it already exists.
 */
export async function createIndex(
  client: Client,
  indexName: string,
  deleteIfExists = true
) {
  if (deleteIfExists) await deleteIndex(client, indexName);
  await client.indices.create({
    index: indexName,
    body: indices[indexName],
  });
}

/**
 * Count the number of documents in an index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 * @returns Number of documents in the index.
 */
async function countIndex(client: Client, indexName: string) {
  const res = await client.count({
    index: indexName,
    body: { query: { match_all: {} } },
  });
  return res?.count;
}

/**
 * Bulk insert or update documents in an index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 * @param documents Array of documents to insert or update.
 * @param idFieldName Optional name of the field to use as the document ID.
 * @param method Either 'index' or 'update'.
 */
export async function bulk(
  client: Client,
  indexName: string,
  documents: any,
  idFieldName: string,
  method = 'index'
) {
  if (client === undefined) throw new Error(ERR_CLIENT);
  const operations = documents.flatMap((doc) => [
    {
      [method]: {
        _index: indexName,
        ...(idFieldName in doc &&
          (doc[idFieldName] || doc[idFieldName] === 0) && {
            _id: doc[idFieldName],
          }),
      },
    },
    ...(method === 'update' ? [{ doc, doc_as_upsert: true }] : [doc]),
  ]);
  const bulkResponse = await client.bulk({ refresh: true, operations });
  console.log(
    'inserted ' + (await countIndex(client, indexName)),
    JSON.stringify(bulkResponse, null, 2)
  );
}

/**
 * Import data from a jsonl file (one JSON object per row, no endline commas)
 *
 * @param indexName  Name of the index.
 * @param dataFilename  Name of the file containing the data.
 * @param idFieldName  Optional name of the field to use as the document ID.
 */
export async function importJsonFileData(
  indexName: string,
  dataFilename: string,
  idFieldName: string
) {
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);
  await createIndex(client, indexName);
  const fileStream = fs.createReadStream(dataFilename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let documents: any[] = [];
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
