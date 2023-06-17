'use strict';

import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { getClient } from '../client';
import { getDocument } from './document';

const SIMILAR_PAGE_SIZE = 24; // 24 results per similar search
const UNKNOWN_CONSTITUENT = 'Unknown'; // Default string for unknown constituent in dataset

export async function similarCollectionObjectsById(
  id: number | string | undefined
) {
  if (!id) return [];
  const docResponse = await getDocument('collections', id);
  const document = docResponse?.data;
  if (document) return similarCollectionObjects(document);
}

/**
 * Get similar objects for a given document
 *
 * @param document The document to get similar objects for
 * @param client The ES client
 * @returns Array of similar objects
 */
export async function similarCollectionObjects(
  document?: any,
  client?: Client
): Promise<CollectionObjectDocument[]> {
  if (!document || !document.id) return [];

  const esQuery = {
    index: 'collections',
    query: {
      bool: {
        must_not: {
          term: {
            id: document.id,
          },
        },
        must: {
          exists: {
            field: 'image',
          },
        },
      },
    },
    from: 0,
    size: SIMILAR_PAGE_SIZE,
  };

  if (
    document.primaryConstituent?.name &&
    document.primaryConstituent?.name !== UNKNOWN_CONSTITUENT
  ) {
    addShouldTerms(document, esQuery, 'primaryConstituent.name', 4);
  }
  //addShouldTerms(esQuery, 'style', document.style, 3.5)
  //addShouldTerms(esQuery, 'movement', document.movement, 3)
  //addShouldTerms(esQuery, 'culture', document.culture, 3)
  addShouldTerms(document, esQuery, 'dynasty', 2);
  //addShouldTerms(esQuery, 'reign', document.reign, 2)
  addShouldTerms(document, esQuery, 'period', 2);
  addShouldTerms(document, esQuery, 'classification', 1.5);
  addShouldTerms(document, esQuery, 'medium', 1);
  addShouldTerms(document, esQuery, 'collections', 1);
  //addShouldTerms(esQuery, 'artistRole', document, 1)
  addShouldTerms(document, esQuery, 'exhibitions', 1);
  addShouldTerms(document, esQuery, 'primaryGeographicalLocation.name', 1);

  if (!client) client = getClient();
  if (client === undefined) return [];
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  if (!response?.hits?.hits?.length) {
    return [];
  }
  return response.hits.hits.map((h) => h._source as CollectionObjectDocument);
}

/**
 * Add a should term with boost to query
 *
 * @param document The document from which to get the value
 * @param esQuery The ES query
 * @param name  The name of the field to add to the term query
 * @returns  Void.  The ES Query is modified in place
 */
function addShouldTerms(
  document: any,
  esQuery: any,
  name: string,
  boost: number
) {
  if (!(name in document)) return;
  let value = document[name];
  if (!(value?.length > 0)) return;
  if (!Array.isArray(value)) value = [value];
  if (!esQuery?.query) esQuery.query = {};
  if (!esQuery.query?.bool) esQuery.query.bool = {};
  if (!esQuery.query.bool?.should) esQuery.query.bool.should = [];
  esQuery.query.bool.should.push({
    terms: {
      [name]: value,
      boost,
    },
  });
}
