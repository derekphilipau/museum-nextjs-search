import { Client } from '@elastic/elasticsearch';

import { type BaseDocument } from '@/types/baseDocument';
import { archives, collections, content, terms } from './indices';

export const ERR_CLIENT = 'Cannot connect to Elasticsearch.';

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
  if (await existsIndex(client, indexName)) {
    try {
      await client.indices.delete({ index: indexName });
    } catch (err) {
      console.error(`Error deleting index ${indexName}: ${err}`);
    }
  }
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
  if (!indices[indexName]) {
    throw new Error(`Index ${indexName} does not exist in indices definition`);
  }
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
  documents: BaseDocument[],
  idFieldName: string,
  method = 'index'
) {
  if (client === undefined) throw new Error(ERR_CLIENT);
  if (!documents || documents?.length === 0) return;
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
  if (bulkResponse.errors) {
    console.log(JSON.stringify(bulkResponse, null, 2));
    throw new Error('Failed to import data');
  }
  console.log(
    `${method} ${
      operations?.length / 2
    } docs, index size now ${await countIndex(client, indexName)}`
  );
}
