import { getClient } from '@/util/elasticsearch/client';
import {
  ERR_CLIENT,
  bulk,
  deleteDocuments,
} from '@/util/elasticsearch/import';
import { options } from '@/util/elasticsearch/search/options';
import slugify from 'slugify';

import { type Term } from '@/types/term';

const MAX_SIZE = 50000;

export async function updateAllTerms() {
  await updateTerms('collections', 'collections');
  await updateTerms('collections', 'classification');
  await updateTerms('collections', 'primaryConstituent.name');
}

async function updateTerms(index, field) {
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);

  const aggs = await options(
    {
      index,
      field,
    },
    MAX_SIZE
  );

  const terms: Term[] = aggs.map((c: any) => ({
    id: `${index}-${field}-${slugify(c.key)}`,
    source: 'TMS',
    sourceId: 'Brooklyn Museum',
    sourceType: null,
    index,
    field,
    value: c.key,
    preferred: null,
    alternates: null,
    summary: null,
    description: null,
  }));
  console.log(terms);

  await deleteDocuments(client, index, field);
  await bulk(client, 'terms', terms, 'id', 'update');
}
