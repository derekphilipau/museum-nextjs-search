/**
 * Import Elasticsearch data from JSON files.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/importDataCommand.ts
 */

import { abort, ask, questionsDone } from '@/util/command';
import { importJsonFileData } from '@/util/elasticsearch/import';
import { importDublinCoreData } from '@/util/elasticsearch/importDublinCore';
import { loadEnvConfig } from '@next/env';

import {
  archivesDataFile,
  artistTermsDataFile,
  collectionsDataFile,
  contentDataFile,
  termsDataFile,
} from '../dataFiles';

const idField = 'id';

loadEnvConfig(process.cwd());

async function run() {
  console.log('Import Elasticsearch data from JSON files.');
  if (process.env.ELASTICSEARCH_USE_CLOUD === 'true')
    console.log('WARNING: Using Elasticsearch Cloud');
  else
    console.log(
      'Using Elasticsearch host at ' + process.env.ELASTICSEARCH_HOST
    );

  if (
    (await ask(
      'Proceeding will overwrite existing Elasticsearch indices & data. Continue? (y/n) '
    )) !== 'y'
  )
    return abort();

  console.log('Beginning import of Elasticsearch data from JSON files...');

  if (
    (await ask(
      `Import collections index from ${collectionsDataFile}? (y/n) `
    )) === 'y'
  )
    await importJsonFileData('collections', collectionsDataFile, idField);

  if (
    (await ask(`Import content index from ${contentDataFile}? (y/n) `)) === 'y'
  )
    await importJsonFileData('content', contentDataFile, idField);

  if ((await ask(`Import terms index from ${termsDataFile}? (y/n) `)) === 'y')
    await importJsonFileData('terms', termsDataFile, idField);

  if (
    (await ask(
      `Import artist terms index from ${artistTermsDataFile}? (y/n) `
    )) === 'y'
  )
    await importJsonFileData('terms', artistTermsDataFile, idField, false);

  if (
    (await ask(`Import archives index from ${archivesDataFile}? (y/n) `)) ===
    'y'
  )
    await importDublinCoreData('archives', archivesDataFile, idField);

  questionsDone();
}

run();
