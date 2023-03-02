import { loadEnvConfig } from '@next/env';

import { importJsonFileData } from './util/elasticsearch/import';
import { importDublinCoreData } from './util/elasticsearch/importDublinCore';

// const collectionsDataFile = './data/collections.jsonl'; // Entire collection ~100,000 records
const collectionsDataFile = './data/collectionsSample.jsonl'; // Sample collection ~10,000 records
const contentDataFile = './data/content.jsonl';
const termsDataFile = './data/terms.jsonl';
const archivesDataFile = './data/archivesSpaceDCRecords.jsonl';

const idField = 'id';

loadEnvConfig(process.cwd());

async function run() {
  await importJsonFileData('collections', collectionsDataFile, idField);
  await importJsonFileData('content', contentDataFile, idField);
  await importJsonFileData('terms', termsDataFile, idField);
  await importDublinCoreData('archives', archivesDataFile, idField);
}

run();
