// TODO remove zlib from package.json
import { getClient } from '@/util/elasticsearch/client';
import {
  bulk,
  createIndex,
  deleteAliasIndices,
  getReadlineInterface,
  snooze,
} from '@/util/elasticsearch/import';
import { searchAll } from '@/util/elasticsearch/search/search';
import { Client } from '@elastic/elasticsearch';

import type { BaseDocument } from '@/types/baseDocument';
import type { DocumentTransform } from '@/types/documentTransform';

async function getAllIds(
  indexName: string,
  idFieldName: string
): Promise<any[]> {
  const ids: any[] = await searchAll(indexName, undefined, [idFieldName]);
  return ids.map((id) => id[idFieldName]);
}

async function createIndexIfNotExists(client: Client, indexName: string) {
  // Check if the index already exists as an alias
  const aliasExists = await client.indices.existsAlias({
    name: indexName,
  });
  if (aliasExists) {
    await deleteAliasIndices(client, indexName);
    console.log(`Deleted existing alias ${indexName}`);
  }
  await createIndex(client, indexName, false); // Create index if doesn't exist
}

/**
 * Update data in Elasticsearch from a jsonl file (one JSON object per row, no endline commas)
 *
 * @param indexName  Name of the index.
 * @param dataFilename  Name of the file containing the data.
 * @param idFieldName  Optional name of the field to use as the document ID.
 */
export async function updateFromJsonlFile(
  indexName: string,
  idFieldName: string,
  dataFilename: string,
  transform: DocumentTransform
) {
  const limit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '1000');
  const isMultiTenant = process.env.ELASTICSEARCH_IS_MULTI_TENANT === 'true';
  const client = getClient();
  createIndexIfNotExists(client, indexName);
  const rl = getReadlineInterface(dataFilename);

  // Bulk insert transformed documents
  const allIds: string[] = [];
  let documents: BaseDocument[] = [];
  for await (const line of rl) {
    try {
      const obj = line ? JSON.parse(line) : undefined;
      if (obj !== undefined) {
        if (transform !== undefined) {
          const transformedObj = await transform(obj, isMultiTenant);
          if (transformedObj) {
            documents.push(transformedObj);
            allIds.push(transformedObj[idFieldName]);
          }
        } else {
          documents.push(obj);
          allIds.push(obj[idFieldName]);
        }
      }
    } catch (err) {
      console.error(`Error parsing line ${line}: ${err}`);
    }

    if (documents.length >= limit) {
      await bulk(client, indexName, documents, idFieldName, 'update');
      documents = [];
      await snooze(2);
    }
  }
  if (documents.length > 0) {
    await bulk(client, indexName, documents, idFieldName, 'update');
  }

  // Delete ids not present in data file
  const esAllIds = await getAllIds(indexName, idFieldName);
  console.log('Got existing index ids: ' + esAllIds?.length);

  const allIdsSet = new Set(allIds);
  const idsToDelete = [...esAllIds].filter((id) => !allIdsSet.has(id));

  console.log('Deleting ' + idsToDelete.length + ' ids');

  await client.deleteByQuery({
    index: indexName,
    body: {
      query: {
        terms: {
          [idFieldName]: idsToDelete,
        },
      },
    },
  });
}
