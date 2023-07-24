/**
 * Import Elasticsearch data from JSON files.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/importDataCommand.ts
 */

import { abort, askYesNo, info, questionsDone, warn } from '@/util/command';
import { loadEnvConfig } from '@next/env';

import { importJsonlFileData } from './importDatafile';
import { updateAdditionalMetadata } from './updateAdditionalMetadata';
import { updateDominantColors } from './updateDominantColors';
import { updateFromJsonlFile } from './updateFromFile';
import { updateAllTerms } from './updateTerms';
import { updateUlanTerms } from './updateUlanTerms';

const ID_FIELD_NAME = 'id';

loadEnvConfig(process.cwd());

async function importDataset(dataset: string, hasMutlipleDatasets = false) {
  let { transform: collectionsTransform } = await import(
    `./transform/${dataset}/transformCollectionObject`
  );
  let { transform: contentTransform } = await import(
    `./transform/${dataset}/transformContent`
  );
  let { transform: archiveTransform } = await import(
    `./transform/${dataset}/transformArchive`
  );

  const collectionsDataFile = `./data/${dataset}/collections.jsonl.gz`;
  const contentDataFile = `./data/${dataset}/content.jsonl.gz`;
  const archivesDataFile = `./data/${dataset}/archivesSpaceDCRecords.jsonl.gz`;
  const additionalMetadataDataFile = `./data/${dataset}/additionalMetadata.jsonl`;

  if (
    await askYesNo(
      `Update collections index with data from ${collectionsDataFile}?`
    )
  )
    await updateFromJsonlFile(
      'collections',
      ID_FIELD_NAME,
      collectionsDataFile,
      collectionsTransform,
      hasMutlipleDatasets
    );

  if (await askYesNo(`Import content index from ${contentDataFile}?`))
    await importJsonlFileData(
      'content',
      ID_FIELD_NAME,
      contentDataFile,
      contentTransform,
      true,
      hasMutlipleDatasets
    );

  if (await askYesNo(`Import archives index from ${archivesDataFile}?`))
    await importJsonlFileData(
      'archives',
      ID_FIELD_NAME,
      archivesDataFile,
      archiveTransform,
      true,
      hasMutlipleDatasets
    );

  if (
    await askYesNo(
      `Update indices with additional metadata from ${additionalMetadataDataFile}?`
    )
  )
    await updateAdditionalMetadata(additionalMetadataDataFile);
}

async function run() {
  info('Import data from gzipped JSONL files.');

  const datasets = (process.env.DATASETS || '').split(',');
  if (datasets.length === 0) {
    warn('No datasets specified.');
    return abort();
  }

  info(`Available datasets: ${datasets.join(', ')}`);

  if (process.env.ELASTICSEARCH_USE_CLOUD === 'true')
    warn('WARNING: Using Elasticsearch Cloud');
  else warn('Using Elasticsearch host at ' + process.env.ELASTICSEARCH_HOST);

  if (
    !(await askYesNo(
      'Proceeding will overwrite existing Elasticsearch indices & data. Continue?'
    ))
  )
    return abort();

  info('Beginning import of Elasticsearch data from JSON files...');

  for (const dataset of datasets) {
    if (await askYesNo(`Import ${dataset} dataset?`))
      await importDataset(dataset, datasets.length > 1);
  }

  if (await askYesNo(`Update terms?`)) await updateAllTerms();
  if (await askYesNo(`Update ULAN terms?`)) await updateUlanTerms();
  if (await askYesNo(`Update dominant colors?`)) await updateDominantColors();

  questionsDone();
}

run();
