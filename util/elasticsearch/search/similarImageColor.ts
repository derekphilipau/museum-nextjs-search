/**
 * NOT CURRENTLY USED
 *
 * Histograms don't work well for color
 * similarity, try dominant colors.
 */

'use strict';

import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type {
  ApiResponseSearch,
  ApiResponseSearchMetadata,
} from '@/types/apiResponseSearch';
import type { BaseDocument } from '@/types/baseDocument';
import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { getClient } from '../client';
import { getDocument } from './document';

const SIMILAR_PAGE_SIZE = 24; // 24 results per similar search

/**
 * Get similar objects for a color
 *
 * @param document The document to get similar objects for
 * @param client The ES client
 * @returns Array of similar objects
 */
export async function similarImageColor(
  color: string,
  p: any,
  client?: Client
): Promise<ApiResponseSearch> {
  const size = SIMILAR_PAGE_SIZE;

  const colors = {
    red: [
      0.5409818345636499, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.45081819546970825, 0.04722857285873134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.09445714571746268, 0.28337143715238805, 0.28337143715238805,
      0.28337143715238805, 0.04722857285873134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.09445714571746268, 0.28337143715238805, 0.28337143715238805,
      0.28337143715238805,
    ],
    yellow: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0.19333910339091295, 0.48334775847728234,
      0.3866782067818259, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632,
    ],
    green: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.3866782067818259, 0.48334775847728234, 0.19333910339091295, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0506364318404772, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632,
    ],
    cyan: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0.45081819546970825, 0.5409818345636499, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0.04722857285873134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.09445714571746268, 0.28337143715238805, 0.28337143715238805,
      0.28337143715238805, 0.04722857285873134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.09445714571746268, 0.28337143715238805, 0.28337143715238805,
      0.28337143715238805,
    ],
    blue: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.19333910339091295,
      0.48334775847728234, 0.3866782067818259, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632,
    ],
    magenta: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0.3866782067818259, 0.48334775847728234, 0.19333910339091295, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632, 0.0506364318404772, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.1012728636809544, 0.3038185910428632, 0.3038185910428632,
      0.3038185910428632,
    ],
  };

  const esQuery: T.SearchRequest = {
    index: 'collections',
    query: {
      script_score: {
        query: { match_all: {} },
        script: {
          source:
            // Ignore objects that don't have an image histogram
            "doc['imageHistogram'].size() == 0 ? 0 : cosineSimilarity(params.queryVector, 'imageHistogram')",
          params: {
            queryVector: colors.yellow,
          },
        },
      },
    },
    from: (p - 1) * size || 0,
    size,
  };

  if (!client) client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);

  let count = response?.hits?.total || 0;
  const options = {};
  if (typeof count !== 'number') count = count.value;
  const metadata = {
    count,
    pages: Math.ceil(count / SIMILAR_PAGE_SIZE),
  };
  const data = response.hits.hits.map((h) => h._source as BaseDocument);
  const res: ApiResponseSearch = { query: esQuery, data, options, metadata };
  return res;
}
