import { createWriteStream } from 'fs';
import { options } from '@/util/elasticsearch/search/options';

import { termsDataFile } from '../dataFiles';

async function getTerms(index, field) {
  const terms = await options({ index, field, q: '' }, 10000);
  return terms
    .filter((t) => t.key !== 'Unknown' && t.key !== '(not assigned)')
    .map((t) => {
      return {
        source: 'TMS',
        sourceId: null,
        sourceType: field,
        field,
        value: t.key,
        preferred: null,
        alternates: null,
        summary: null,
        description: null,
      };
    });
}

async function transformData() {
  const outputStream = createWriteStream(termsDataFile);
  const classification = await getTerms('collections', 'classification');
  const collections = await getTerms('collections', 'collections');
  const allTerms = [...classification, ...collections];
  for await (const term of allTerms) {
    outputStream.write(`${JSON.stringify(term)}\n`);
  }
}

export async function createTerms() {
  await transformData();
}
