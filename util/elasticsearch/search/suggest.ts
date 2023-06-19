'use strict';

import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiResponseSuggest } from '@/types/apiResponseSearch';
import { Term } from '@/types/term';
import { getClient } from '../client';

const MAX_SUGGESTIONS = 10;

export async function suggest(params: any) {
  let { q } = params;
  const client = getClient();
  if (client === undefined) return {};
  const esQuery: T.SearchRequest = {
    index: 'terms',
    query: {
      multi_match: {
        query: q,
        type: 'bool_prefix',
        fields: [
          'value.suggest',
          'value.suggest._2gram',
          'value.suggest._3gram',
        ],
      },
    },
    _source: ['field', 'value'], // Just return the value
    size: MAX_SUGGESTIONS,
};

  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const data = response.hits.hits.map((h) => h._source as Term);
  const res: ApiResponseSuggest = { query: esQuery, data };
  return res;
}
