import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { getClient } from '../client';
import { getDocument } from './document';

const SIMILAR_PAGE_SIZE = 24; // 24 results per similar search
const UNKNOWN_CONSTITUENT = 'Unknown'; // Default string for unknown constituent in dataset

export async function similarCollectionObjectEmbeddingById(
  id: number | string | undefined
): Promise<any[]> {
  if (!id) return [];
  const docResponse = await getDocument('collections', id, false);
  const document = docResponse?.data as CollectionObjectDocument;
  if (document) return similarCollectionObjectEmbedding(document);
  return [];
}

/**
 * Get similar objects for a given document
 *
 * @param document The document to get similar objects for
 * @param client The ES client
 * @returns Array of similar objects
 */
export async function similarCollectionObjectEmbedding(
  document?: CollectionObjectDocument,
  client?: Client
): Promise<any[]> {
  if (!document || !document.id || !document?.image?.embedding) return [];

  const input_vector = document.image.embedding;

  const esQuery: T.SearchRequest = {
    index: 'collections',
    query: {
      bool: {
        must: [
          { exists: { field: 'image.embedding' } },
          {
            script_score: {
              query: { match_all: {} },
              script: {
                source:
                  "cosineSimilarity(params.query_vector, 'image.embedding') + 1.0",
                params: { query_vector: input_vector },
              },
            },
          },
        ],
        must_not: {
          term: {
            id: document.id,
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
