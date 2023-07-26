import { getClient } from '@/util/elasticsearch/client';
import {
  bulk,
  createIndex,
  deleteDocuments,
  getBulkOperationArray,
} from '@/util/elasticsearch/import';
import type { AggOption } from '@/types/aggOption';
import { options } from '@/util/elasticsearch/search/options';
import slugify from 'slugify';

import { type Term } from '@/types/term';

export async function updateAllTerms() {
  const client = getClient();

  // Re-create terms index, effectively deleting the old one
  // TODO: Only needed when migrating from an old version of the index
  await createIndex(client, 'terms', true, true);

  await updateTerms('collections', 'departments');
  await updateTerms('collections', 'classification');
  await updateTerms('collections', 'primaryConstituent.name');
  await updateTerms('collections', 'exhibitions');
}

/**
 * This function performs the core task of getting all documents from the Elasticsearch index
 * and then process the specific field in each document to create new terms.
 *
 * @param index The Elasticsearch index to search
 * @param field The field in the Elasticsearch index to process
 * @param fieldUniqueId The unique id field in the field object (if it's an object)
 * @param valueFieldProperty The property in the field object to use as the value
 */
async function updateTerms(
  index: string,
  field: string,
) {
  // Just index the top 10000 results
  const esTerms: AggOption[] = await options({ index, field }, 10000);
  const terms: Term[] = esTerms.map((esTerm: any) => ({
    index,
    field,
    value: esTerm.key,
  }));
  const operations: any[] = [];
  for (const term of terms) {
    if (term.value) {
      const id = `${index}-${field}-${slugify(term.value)}`;
      operations.push(...getBulkOperationArray('update', 'terms', id, term));  
    }
  }

  const client = getClient();

  await createIndex(client, 'terms', false, false);

  // Delete old documents from the index
  await deleteDocuments(client, index, field);

  // Bulk update the terms index with new terms
  await bulk(client, operations);
}
