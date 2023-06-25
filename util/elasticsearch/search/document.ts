'use strict';

import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiResponseDocument } from '@/types/apiResponseDocument';
import type { BaseDocument } from '@/types/baseDocument';
import { getClient } from '../client';
import { similarDominantColors } from './similarDominantColors';
import { similarCollectionObjects } from './similarObjects';

/**
 * Get a document by Elasticsearch id
 *
 * @param index Index to search
 * @param id ID of document to search for
 * @returns Elasticsearch Document
 */
export async function getDocument(
  index: string,
  id: number | string,
  getAdditionalData: boolean = true
): Promise<ApiResponseDocument> {
  const esQuery: T.SearchRequest = {
    index,
    query: {
      match: {
        id,
      },
    },
  };
  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const data = response?.hits?.hits[0]?._source as BaseDocument;
  const apiResponse: ApiResponseDocument = { query: esQuery, data };
  if (index === 'collections' && getAdditionalData) {
    apiResponse.similar = await similarCollectionObjects(data, client);
    apiResponse.similarDominantColors = await similarDominantColors(
      data,
      client
    );
  }
  return apiResponse;
}
