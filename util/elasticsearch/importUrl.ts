import { createIndex, bulk, snooze } from './import';
import { getClient } from './client';
import axios, { AxiosResponse } from 'axios';
import { getLatestDatafileUrlPath } from '@/util/data/dataFiles';
import pako from 'pako';

/**
 * Import data from a jsonl file (one JSON object per row, no endline commas)
 *
 * @param indexName  Name of the index.
 * @param idFieldName  Optional name of the field to use as the document ID, e.g. 'id'.
 * @param transform  A function to transform the JSON data before indexing.
 * @param isCreateIndex  Whether to create the index if it doesn't exist.
 */
export async function importJsonFileDataFromUrl(
  indexName: string,
  idFieldName: string,
  transform: (row: any) => any = (row) => row,
  isCreateIndex = true,
) {
  const limit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '100');
  const client = getClient();
  if (client === undefined) throw new Error('Cannot connect to Elasticsearch.');
  if (isCreateIndex) await createIndex(client, indexName);

  const url = getLatestDatafileUrlPath(indexName);

  // Make a GET request to the URL
  axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  })
  .then(async function (response: AxiosResponse) {
    const decompressedData: string = pako.inflate(response.data, { to: 'string' });

    let documents: any[] = [];

    const lines: string[] = decompressedData.split('\n');

    for (const line of lines) {
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
        await bulk(client, indexName, documents, idFieldName);
        documents = [];
        await snooze(2);
      }
    }
    if (documents.length > 0) {
      await bulk(client, indexName, documents, idFieldName);
    }
  })
  .catch(function (error: any) {
    console.error(error);
  });  
}
