'use strict';

import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { Term } from '@/types/term';
import { getClient } from '../client';

const TERMS_PAGE_SIZE = 12; // 12 results per aggregation terms search

/**
 * Get terms for a query. Used for "Did you mean?"
 *
 * @param query The query to search for
 * @param size Number of terms to return
 * @param client The ES client
 * @returns Array of terms
 */
export async function terms(
  query?: string | string[],
  size: number = TERMS_PAGE_SIZE,
  client?: Client
): Promise<Term[]> {
  const myQuery = Array.isArray(query) ? query.join(' ') : query;
  if (!myQuery || myQuery === undefined) return [];
  const request: T.SearchRequest = {
    index: 'terms',
    query: {
      multi_match: {
        query: myQuery,
        fields: [ "value^3", "alternates" ],
        fuzziness: 'AUTO:3,7',
      }
    },
    from: 0,
    size,
  };

  if (!client) client = getClient();
  if (client === undefined) return [];
  try {
    const response: T.SearchTemplateResponse = await client.search(request);
    return response.hits.hits.map((h) => h._source as Term);
  } catch (e) {
    console.error(e);
  }
  return [];
}
