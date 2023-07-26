// TODO remove zlib from package.json
import { getClient } from '@/util/elasticsearch/client';
import {
  bulk,
  getBulkOperationArray,
  createIndex,
  getReadlineInterface,
  snooze,
} from '@/util/elasticsearch/import';
import { searchAll } from '@/util/elasticsearch/search/search';

import type { ElasticsearchTransformer } from '@/types/elasticsearchTransformer';

/**
 * Update data in Elasticsearch from a jsonl file (one JSON object per row, no endline commas)
 *
 * @param indexName  Name of the index.
 * @param dataFilename  Name of the file containing the data.
 * @param idFieldName  Optional name of the field to use as the document ID.
 */
export default async function updateFromJsonlFile(
  indexName: string,
  dataFilename: string,
  transformer: ElasticsearchTransformer,
  includeSourcePrefix = false
) {
  const bulkLimit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '1000');
  const maxBulkOperations = bulkLimit * 2;
  const client = getClient();
  createIndex(client, indexName, false, true);
  const rl = getReadlineInterface(dataFilename);

  const allIds: string[] = [];
  let operations: any[] = [];
  for await (const line of rl) {
    try {
      const obj = line ? JSON.parse(line) : undefined;
      if (obj !== undefined) {
        const doc = await transformer.documentTransformer(obj);
        if (doc !== undefined) {
          const id = transformer.idGenerator(doc, includeSourcePrefix);
          if (doc && id) {
            operations.push(...getBulkOperationArray('update', indexName, id, doc));
            allIds.push(id);
          }
        }
      }
    } catch (err) {
      console.error(`Error parsing line ${line}: ${err}`);
    }

    if (operations.length >= maxBulkOperations) {
      await bulk(client, operations);
      operations = [];
      await snooze(2);
    }
  }
  if (operations.length > 0) {
    await bulk(client, operations);
  }

  // Delete ids not present in data file
  const hits: any[] = await searchAll(indexName, undefined, ['id']);
  const esAllIds = hits.map((hit) => hit._id);

  console.log('Got existing index ids: ' + esAllIds?.length);

  const allIdsSet = new Set(allIds);
  const idsToDelete = [...esAllIds].filter((id) => !allIdsSet.has(id));

  console.log('Deleting ' + idsToDelete.length + ' ids');

  const deleteChunkSize = 10000;
  for (let i = 0; i < idsToDelete.length; i += deleteChunkSize) {
    const chunk = idsToDelete.slice(i, i + deleteChunkSize);
    await client.deleteByQuery({
      index: indexName,
      body: {
        query: {
          ids: {
            values: chunk,
          }
        },
      },
    });
  }
}
