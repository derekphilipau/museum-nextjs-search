import * as fs from 'fs';
import * as readline from 'node:readline';
import zlib from 'zlib';
import { getClient } from '@/util/elasticsearch/client';
import {
  ERR_CLIENT,
  bulk,
  createTimestampedIndex,
  setIndexAsAlias,
  snooze,
} from '@/util/elasticsearch/import';

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
  transform: (row: any) => any = (row) => row,
  isCreateIndex = true
) {
  const limit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '100');
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);

  let realIndexName = indexName;
  if (isCreateIndex) {
    realIndexName = await createTimestampedIndex(client, indexName)
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
          const transformedObj = await transform(obj);
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
    await setIndexAsAlias(client, indexName, realIndexName)
  }
}
