import * as T from '@elastic/elasticsearch/lib/api/types';

import type { AggOptions } from './aggOptions';
import type { BasicDocument } from './basicDocument';
import type { Term } from './term';

export interface ApiResponseSearch {
  query?: T.SearchRequest;
  data?: BasicDocument[];
  terms?: Term[];
  options?: AggOptions;
  metadata?: any;
  apiError?: string;
  error?: any;
}
