'use strict';

import * as T from '@elastic/elasticsearch/lib/api/types';

import type { AggOption } from '@/types/aggOption';
import { getClient } from '../client';

const OPTIONS_PAGE_SIZE = 20; // 20 results per aggregation options search

interface OptionsParams {
  index?: string | string[]; // Indices to search
  field?: string; // Field to get options for
  q?: string; // Query string
}

/**
 * Get options/buckets for a specific field/agg
 * @param params
 * @param size Number of options to return
 * @returns
 */
export async function options(
  params: OptionsParams,
  size = OPTIONS_PAGE_SIZE
): Promise<AggOption[]> {
  const { index, field, q } = params;

  if (!index || !field) {
    return [];
  }

  const request: T.SearchRequest = {
    index,
    size: 0,
    aggs: {
      [field]: {
        terms: {
          field,
          size,
        },
      },
    },
  };

  if (q) {
    request.query = {
      wildcard: {
        [field]: {
          value: '*' + q + '*',
          case_insensitive: true,
        },
      },
    };
  }

  const client = getClient();
  if (client === undefined) return [];
  try {
    const response: T.SearchTemplateResponse = await client.search(request);
    if (response.aggregations?.[field] !== undefined) {
      const aggAgg: T.AggregationsAggregate = response.aggregations?.[field];
      if ('buckets' in aggAgg && aggAgg?.buckets) return aggAgg.buckets;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}
