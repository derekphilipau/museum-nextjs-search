/**
 * Import Elasticsearch data from JSON files.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/importDataCommand.ts
 */

import { abort, askYesNo, info, questionsDone, warn } from '@/util/command';
import { loadEnvConfig } from '@next/env';

import type { Dataset } from '@/types/dataset';
import { siteConfig } from '@/config/site';
import { updateAdditionalMetadata } from './updateAdditionalMetadata';
import { updateDominantColors } from './updateDominantColors';
import updateFromJsonlFile from './updateFromJsonlFile';
import { updateAllTerms } from './updateTerms';
import { updateUlanTerms } from './updateUlanTerms';

loadEnvConfig(process.cwd());

async function importDataset(dataset: Dataset, includeSourcePrefix: boolean) {
  for (const indexName of dataset.indices) {
    if (await askYesNo(`Update ${dataset.name} ${indexName} index?`)) {
      const dataFile = `./data/${dataset.sourceName}/${indexName}.jsonl.gz`;
      try {
        const { transformer } = await import(`./transform/${dataset.sourceName}/${indexName}Transformer`);
        await updateFromJsonlFile(
          indexName,
          dataFile,
          transformer,
          includeSourcePrefix
        );
      } catch (e) {
        abort(`Error updating ${dataset.name} ${indexName} index: ${e}`);
        return;
      }
    }
  }
}

async function run() {
  info('Import data from gzipped JSONL files.');

  if (siteConfig.datasets.length === 0) {
    warn('No datasets specified.');
    return abort();
  }

  info(`Available datasets: ${siteConfig.datasets.map((d) => d.name).join(', ')}`);

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

  const includeSourcePrefix = siteConfig.datasets.length > 1;

  for (const dataset of siteConfig.datasets) {
    if (await askYesNo(`Import ${dataset.name} dataset?`)) {
      await importDataset(dataset, includeSourcePrefix);
    }
  }

  if (await askYesNo(`Update indices with additional metadata?`)) {
    const additionalMetadataDataFile = `./data/additionalMetadata.jsonl`;
    await updateAdditionalMetadata(additionalMetadataDataFile);
  }

  if (await askYesNo(`Update terms?`)) await updateAllTerms();
  if (await askYesNo(`Update ULAN terms?`)) await updateUlanTerms();
  if (await askYesNo(`Update dominant colors?`)) await updateDominantColors();

  questionsDone();
}

run();
