import * as fs from 'fs';
import * as readline from 'node:readline';
import zlib from 'zlib';
// TODO remove zlib from package.json
import { getClient } from '@/util/elasticsearch/client';
import {
  ERR_CLIENT,
  bulk,
  createIndex,
  deleteAliasIndices,
  snooze,
} from '@/util/elasticsearch/import';
import { searchAll } from '@/util/elasticsearch/search/search';

async function getAllIds(
  indexName: string,
  idFieldName: string
): Promise<any[]> {
  const ids: any[] = await searchAll(indexName, undefined, [idFieldName]);
  return ids.map((id) => id[idFieldName]);
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
  transform: (row: any) => any = (row) => row
) {
  const limit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '1000');
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);

  // Check if the index already exists as an alias
  const aliasExists = await client.indices.existsAlias({
    name: indexName,
  });
  if (aliasExists) {
    await deleteAliasIndices(client, indexName);
    console.log(`Deleted existing alias ${indexName}`);
  }
  await createIndex(client, indexName, false); // Create index if doesn't exist

  const fileStream = fs
    .createReadStream(dataFilename)
    .pipe(zlib.createGunzip());
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const allIds: any[] = [];
  let documents: any[] = [];
  for await (const line of rl) {
    try {
      const obj = line ? JSON.parse(line) : undefined;
      if (obj !== undefined) {
        if (transform !== undefined) {
          const transformedObj = await transform(obj);
          if (transformedObj) documents.push(transformedObj);
        } else {
          documents.push(obj);
        }
        allIds.push(obj[idFieldName]);
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

  const esAllIds = await getAllIds(indexName, idFieldName);
  console.log('Got existing index ids: ' + esAllIds?.length);

  // find IDs that exist in Elasticsearch but not in `allIdsSet`
  const allIdsSet = new Set(allIds);
  const idsToDelete = [...esAllIds].filter((id) => !allIdsSet.has(id));

  console.log('Deleting ' + idsToDelete.length + ' ids');
  console.log(idsToDelete);

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
