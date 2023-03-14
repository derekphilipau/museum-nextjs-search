'use strict';

import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { getClient } from '../client';
import { getDocument } from './document';

const SIMILAR_PAGE_SIZE = 24; // 24 results per similar search

export async function similarImageHistogramById(
  id: number | string | undefined
) {
  if (!id) return [];
  const docResponse = await getDocument('collections', id);
  const document = docResponse?.data;
  if (document) return similarImageHistogram(document);
}

/**
 * Get similar objects for a given document
 *
 * @param document The document to get similar objects for
 * @param client The ES client
 * @returns Array of similar objects
 */
export async function similarImageHistogram(
  document?: any,
  client?: Client
): Promise<CollectionObjectDocument[]> {
  if (!document || !document.id || !document.imageHistogram) return [];

  const esQuery = {
    index: 'collections',
    query: {
      script_score: {
        query: {
          bool: {
            must_not: {
              term: {
                id: document.id, // Exclude current document
              },
            },
          },
        },
        script: {
          source:
            // Ignore objects that don't have an image histogram
            "doc['imageHistogram'].size() == 0 ? 0 : cosineSimilarity(params.queryVector, 'imageHistogram')",
          params: {
            queryVector: document.imageHistogram,
          },
        },
      },
    },
    from: 0,
    size: SIMILAR_PAGE_SIZE,
  };

  if (!client) client = getClient();
  if (client === undefined) return [];
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  if (!response?.hits?.hits?.length) {
    return [];
  }
  return response.hits.hits.map((h) => h._source as CollectionObjectDocument);
}
