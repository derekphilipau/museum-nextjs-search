import * as T from '@elastic/elasticsearch/lib/api/types';

import type { AggOptions } from './aggOptions';
import type { BasicDocument } from './basicDocument';
import type { Term } from './term';

export interface ApiResponseSearchMetadata {
  count?: number;
  pages?: number;
}

export interface ApiResponseSearch {
  query?: T.SearchRequest;
  data?: BasicDocument[];
  terms?: Term[];
  filters?: Term[];
  options?: AggOptions;
  metadata?: ApiResponseSearchMetadata;
  apiError?: string;
  error?: any;
}
