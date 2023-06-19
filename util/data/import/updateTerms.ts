import { getClient } from '@/util/elasticsearch/client';
import { ERR_CLIENT, bulk, deleteDocuments, createIndex } from '@/util/elasticsearch/import';
import { searchAll } from '@/util/elasticsearch/search/search';
import slugify from 'slugify';

import { type Term } from '@/types/term';

export async function updateAllTerms() {

  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);
  // Re-create terms index, effectively deleting the old one
  // TODO: Only needed when migrating from an old version of the index
  await createIndex(client, 'terms', true);

  await updateTerms('collections', 'collections');
  await updateTerms('collections', 'classification');
  await updateTerms('collections', 'primaryConstituent', 'id', 'name');
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
  fieldUniqueId?: string,
  valueFieldProperty?: string
) {
  // Search all documents with the specific field:
  const docs: any[] = await searchAll(
    index,
    { exists: { field } },
    [field]
  );
  // Map all results into a new array that only contains the specific field:
  const results: any[] = docs.map((o: any) => o[field]);

  let uniqueResults: any[] = [];
  for (const result of results) {
    if (Array.isArray(result)) {
      // If the result is an array, add all its elements
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

  // Map all unique results to a new array of terms
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

  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);

  // Delete old documents from the index
  await deleteDocuments(client, index, field);
  // Bulk update the terms index with new terms
  await bulk(client, 'terms', terms, 'id', 'update');
}
