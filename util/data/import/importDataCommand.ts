/**
 * Import Elasticsearch data from JSON files.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/importDataCommand.ts
 */

import { abort, ask, questionsDone } from '@/util/command';
import { importJsonFileData } from '@/util/elasticsearch/import';
import { loadEnvConfig } from '@next/env';

const idField = 'id';

loadEnvConfig(process.cwd());

async function run() {

  const dataset = process.env.DATASET || 'brooklynMuseum';
  let ctm = await import(`./transform/${dataset}/transformCollectionObject`);
  const collectionsTransformable = ctm.transformable;
  ctm = await import(`./transform/${dataset}/transformContent`);
  const contentTransformable = ctm.transformable;
  ctm = await import(`./transform/${dataset}/transformArchive`);
  const archiveTransformable = ctm.transformable;  

  const collectionsDataFile = `./data/${dataset}/collections.jsonl`;
  const contentDataFile = `./data/${dataset}/content.jsonl`;
  const termsDataFile = `./data/${dataset}/terms.jsonl`;
  const artistTermsDataFile = `./data/${dataset}/artistTerms.jsonl`;
  const archivesDataFile = `./data/${dataset}/archivesSpaceDCRecords.jsonl`;

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
    await importJsonFileData(
      'collections',
      idField,
      collectionsDataFile,
      collectionsTransformable.transform,
      true
    );

  if (
    (await ask(`Import content index from ${contentDataFile}? (y/n) `)) === 'y'
  )
    await importJsonFileData(
      'content',
      idField,
      contentDataFile,
      contentTransformable.transform,
      true
    );

  /*

  if ((await ask(`Import terms index from ${termsDataFile}? (y/n) `)) === 'y')
    await importJsonFileData('terms', termsDataFile, idField);

  if (
    (await ask(
      `Import artist terms index from ${artistTermsDataFile}? (y/n) `
    )) === 'y'
  )
    await importJsonFileData('terms', artistTermsDataFile, idField, false);
      */
  if (
    (await ask(`Import archives index from ${archivesDataFile}? (y/n) `)) ===
    'y'
  )
    await importJsonFileData(
      'archives',
      idField,
      archivesDataFile,
      archiveTransformable.transform,
      true
    );

  questionsDone();
}

run();
