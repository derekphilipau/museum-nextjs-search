import { getClient } from '@/util/elasticsearch/client';
import { ERR_CLIENT, bulk, deleteDocuments, createIndex } from '@/util/elasticsearch/import';
import { searchAll } from '@/util/elasticsearch/search/search';
import slugify from 'slugify';

import { type Term } from '@/types/term';

const MAX_SIZE = 50000;

export async function updateAllTerms() {

  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);
  await createIndex(client, 'terms', true);

  await updateTerms('collections', 'collections');
  await updateTerms('collections', 'classification');
  await updateTerms('collections', 'primaryConstituent', 'id', 'name');
}

async function updateTerms(
  index: string,
  field: string,
  fieldUniqueId?: string,
  valueFieldProperty?: string
) {
  const collectionObjects: any[] = await searchAll(
    index,
    { exists: { field } },
    [field]
  );
  const results: any[] = collectionObjects.map((o: any) => o[field]);
  let uniqueResults: any[] = [];
  for (const result of results) {
    if (Array.isArray(result)) {
      uniqueResults.push(...result);
    } else {
      uniqueResults.push(result);
    }
  }
  if (
    uniqueResults.length &&
    typeof uniqueResults[0] === 'object' && // make sure it's an object
    fieldUniqueId
  ) {
    // Remove duplicates based on the field's unique id:
    uniqueResults = uniqueResults.filter(
      (element, index, self) =>
        index ===
        self.findIndex((t) => t[fieldUniqueId] === element[fieldUniqueId])
    );
  } else if (uniqueResults.length && typeof uniqueResults[0] === 'string') {
    // Remove duplicate strings:
    uniqueResults = [...new Set(uniqueResults)];
  }

  const terms: Term[] = uniqueResults.map((c: any) => ({
    id: `${index}-${field}-${
      c?.id || slugify(valueFieldProperty ? c[valueFieldProperty] : c)
    }`,
    source: 'TMS',
    sourceId: 'Brooklyn Museum',
    sourceType: null,
    index,
    field,
    value: valueFieldProperty ? c[valueFieldProperty] : c,
    preferred: null,
    alternates: null,
    summary: null,
    description: null,
    data: typeof c === 'object' ? c : null,
  }));
  console.log(terms);

  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);

  await deleteDocuments(client, index, field);
  await bulk(client, 'terms', terms, 'id', 'update');
}
