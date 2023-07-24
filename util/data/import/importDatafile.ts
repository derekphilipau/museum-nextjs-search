import * as fs from 'fs';
import * as readline from 'node:readline';
import zlib from 'zlib';
// TODO remove zlib from package.json
import { getClient } from '@/util/elasticsearch/client';
import {
  bulk,
  createTimestampedIndex,
  setIndexAsAlias,
  snooze,
} from '@/util/elasticsearch/import';

import type { DocumentTransform } from '@/types/documentTransform';

/**
 * Import data from a jsonl file (one JSON object per row, no endline commas)
 *
 * @param indexName  Name of the index.
 * @param dataFilename  Name of the file containing the data.
 * @param idFieldName  Optional name of the field to use as the document ID.
 */
export async function importJsonlFileData(
  indexName: string,
  idFieldName: string,
  dataFilename: string,
  transform: DocumentTransform,
  isCreateIndex = true,
  hasMutlipleDatasets = false
) {
  const limit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '1000');
  const client = getClient();

  let realIndexName = indexName;
  if (isCreateIndex) {
    realIndexName = await createTimestampedIndex(client, indexName);
  }

  const fileStream = fs
    .createReadStream(dataFilename)
    .pipe(zlib.createGunzip());
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let documents: any[] = [];
  for await (const line of rl) {
    try {
      const obj = line ? JSON.parse(line) : undefined;
      if (obj !== undefined) {
        if (transform !== undefined) {
          const transformedObj = await transform(obj, hasMutlipleDatasets);
          if (transformedObj) documents.push(transformedObj);
        } else {
          documents.push(obj);
        }
      }
    } catch (err) {
      console.error(`Error parsing line ${line}: ${err}`);
    }

    if (documents.length >= limit) {
      await bulk(client, realIndexName, documents, idFieldName);
      documents = [];
      await snooze(2);
    }
  }
  if (documents.length > 0) {
    await bulk(client, realIndexName, documents, idFieldName);
  }

  if (isCreateIndex && indexName !== realIndexName) {
    // We just populated a timestamped index, point alias to it
    await setIndexAsAlias(client, indexName, realIndexName);
  }
}
