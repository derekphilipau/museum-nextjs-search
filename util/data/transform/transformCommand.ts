/**
 * For use with http://ulandownloads.getty.edu/ ULAN XML files.
 */

import { abort, ask, questionsDone } from '@/util/command';
import { loadEnvConfig } from '@next/env';

import { createArtistTerms } from '../transform/transformBkMArtists';
import { createTerms } from '../transform/transformTerms';
import { transformUlan } from './transformUlan';

loadEnvConfig(process.cwd());

async function run() {
  console.log(
    'This script will transform raw data files into Elasticsearch JSON.'
  );

  if (
    (await ask(
      `Transform ULAN XML to Elasticsearch JSON terms? (Only needed if ULAN data has been modified.) (y/n) `
    )) === 'y'
  )
    await transformUlan();

  if ((await ask(`Create Elasticsearch JSON Artist terms? (y/n) `)) === 'y')
    await createArtistTerms();

  if ((await ask(`Create Elasticsearch JSON terms? (y/n) `)) === 'y')
    await createTerms();

  questionsDone();
}

run();
