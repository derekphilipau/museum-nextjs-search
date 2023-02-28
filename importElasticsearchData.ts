import { loadEnvConfig } from '@next/env';

import { importData } from './util/elasticsearch/import';

// const collectionsDataFile = './data/collections.jsonl'; // Entire collection ~100,000 records
const collectionsDataFile = './data/collectionsSample.jsonl'; // Sample collection ~10,000 records
const contentDataFile = './data/content.jsonl';
const termsDataFile = './data/terms.jsonl';

const idField = 'id';

loadEnvConfig(process.cwd());

async function run() {
  //await importData('collections', collectionsDataFile, idField);
  await importData('content', contentDataFile, idField);
  await importData('terms', termsDataFile, idField);
}

run();
