import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

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
 * Generates a timestamped index name.
 *
 * This function takes an index name as a string, generates a timestamp,
 * and then appends this timestamp to the original index name. The timestamp
 * is derived from the current date and time, and is formatted to remove any
 * characters that might not be suitable in an index name.
 *
 * @param indexName The original index name.
 * @returns The original index name appended with a timestamp.
 */
export function getTimestampedIndexName(indexName: string): string {
  // Generate an ISO string for the current date and time.
  const timestamp = new Date().toISOString();

  // Format the timestamp to remove 'T', ':', and any characters after (and including) the '.'
  const formattedTimestamp = timestamp
    .replace('T', '_') // Replace 'T' with '_'
    .replaceAll(':', '') // Remove ':'
    .replace(/\..+?Z/, ''); // Remove any characters after and including the '.'

  // Append the formatted timestamp to the original index name and return.
  return `${indexName}_${formattedTimestamp}`;
}

/**
 * Create an Elasticsearch index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 */
export async function createTimestampedIndex(
  client: Client,
  indexName: string
) {
  const timestampedIndexName = getTimestampedIndexName(indexName);

  if (!indices[indexName]) {
    throw new Error(`Index ${indexName} does not exist in indices definition`);
  }
  await client.indices.create({
    index: timestampedIndexName,
    body: indices[indexName],
  });
  return timestampedIndexName;
}

/**
 * Associate a timestamped index with an alias.  If the alias already exists,
 * it will be removed from any other indices and associated with the new index.
 * Any old indices will be deleted.
 * 
 * @param client Elasticsearch client.
 * @param aliasName Name of the alias.
 * @param newIndexName Name of the new timestamped index.
 */
export async function setIndexAsAlias(
  client: Client,
  aliasName: string,
  newIndexName: string
) {
  // Get status of OpenSearch:
  const statusResponse: T.IndicesStatsResponse = await client.indices.stats();

  // Check if the alias already exists
  const aliasExists = await client.indices.existsAlias({
    name: aliasName,
  });
  if (!aliasExists) {
    // Alias does not exist
    // If an index already exists with the alias name, delete it
    await deleteIndex(client, aliasName);
  } else {
    // Alias already exists
    const aliasResponse: T.IndicesGetAliasResponse =
      await client.indices.getAlias({
        name: aliasName,
      });
    if (aliasResponse) {
      // Response is an object with keys that are the real index names,
      // and values that are objects with keys that are the alias names:
      // { 'content_2023-06-17_031903': { aliases: { content: {} } } }
      for (const oldIndexName of Object.keys(aliasResponse)) {
        // Remove the old aliases
        await client.indices.deleteAlias({
          name: aliasName,
          index: oldIndexName,
        });
      }
    }
  }

  // Switch alias to new index
  await client.indices.putAlias({
    name: aliasName,
    index: newIndexName,
  });

  // Now, remove all old timestamped indices
  if (statusResponse.indices && typeof statusResponse.indices === 'object') {
    for (const timestampedIndexName of Object.keys(statusResponse.indices)) {
      if (
        aliasName === timestampedIndexName.split('_', 1)[0] &&
        timestampedIndexName !== newIndexName
      ) {
        await deleteIndex(client, timestampedIndexName);
      }
    }
  }
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
 * @param documents Array of BaseDocument to insert or update.
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
