import type { BaseDocument } from './baseDocument';

export interface ElasticsearchIdGenerator {
  (doc: BaseDocument, includeSourcePrefix?: boolean): string;
}

export interface ElasticsearchDocumentTransformer {
  (doc: any): Promise<BaseDocument | undefined>;
}

export interface ElasticsearchTransformer {
  idGenerator: ElasticsearchIdGenerator;
  documentTransformer: ElasticsearchDocumentTransformer;
}
