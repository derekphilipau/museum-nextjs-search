/**
 * For use with http://ulandownloads.getty.edu/ ULAN XML files.
 */
import { loadEnvConfig } from '@next/env';

import { createArtistTerms } from './util/import/createArtistTermsFile';
import { createTerms } from './util/import/createTermsFile';
import { importJsonFileData } from './util/elasticsearch/import';

loadEnvConfig(process.cwd());

async function run() {
  //await createArtistTerms();
  //await createTerms();
  await importJsonFileData('terms', './data/artistTerms.jsonl', '');
  await importJsonFileData('terms', './data/terms.jsonl', '', false);
}

run();