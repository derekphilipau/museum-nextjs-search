import type { BaseDocument } from './baseDocument';
import type { Term, TermIdMap } from './term';

/**
 * Function type for generating an ID for Elasticsearch documents.
 * `includeSourcePrefix` is an optional flag to include a source prefix in the ID,
 * used when there are multiple datasets to avoid ID collisions.
 */
export interface ElasticsearchIdGenerator {
  (doc: BaseDocument | Term, includeSourcePrefix?: boolean): string;
}

/**
 * Function type for extracting terms from a `BaseDocument`.  Optional.
 */
export interface ElasticsearchTermsExtractor {
  (doc: BaseDocument): Promise<TermIdMap | undefined>;
}

/**
 * Function type for transforming any document to a `BaseDocument` or `Term`.
 */
export interface ElasticsearchDocumentTransformer {
  (doc: any): Promise<BaseDocument | Term | undefined>;
}

/**
 * Defines the structure of an Elasticsearch transformer, with all functions required
 * to transform data for use in Elasticsearch.
 */
export interface ElasticsearchTransformer {
  idGenerator: ElasticsearchIdGenerator;
  documentTransformer: ElasticsearchDocumentTransformer;
  termsExtractor?: ElasticsearchTermsExtractor;
}
