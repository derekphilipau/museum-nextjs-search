import * as T from '@elastic/elasticsearch/lib/api/types';

export const index: T.IndicesIndexSettings = {
  number_of_shards: 1,
  number_of_replicas: 1,
};

export const analysis: T.IndicesIndexSettingsAnalysis = {
  analyzer: {
    unaggregatedStandardAnalyzer: {
      type: 'custom',
      tokenizer: 'standard',
      char_filter: ['hyphenApostropheMappingFilter'],
      filter: ['lowercase', 'asciifolding', 'enSnowball'],
    },
    aggregatedKeywordAnalyzer: {
      type: 'custom',
      tokenizer: 'keyword',
      char_filter: ['hyphenApostropheMappingFilter'],
      filter: ['lowercase', 'asciifolding'],
    },
    aggregatedSimpleKeywordAnalyzer: {
      type: 'custom',
      tokenizer: 'keyword',
      filter: ['lowercase'],
    },
    suggestAnalyzer: {
      type: 'custom',
      tokenizer: 'standard',
      char_filter: ['hyphenApostropheMappingFilter'],
      filter: ['lowercase', 'asciifolding'],
    },
  },
  char_filter: {
    hyphenApostropheMappingFilter: {
      type: 'mapping',
      mappings: ['-=>\\u0020', "'=>", '’=>'],
    },
    /*
    // Currently unused.
    articleCharFilter: { // T.AnalysisPatternReplaceCharFilter
      type: 'pattern_replace',
      pattern:
        "(^[Ddol]') |(^(van der|van|de la|de|du|da|di|le|la) )|( [dol]')",
      replacement: ' ',
    },
    */
  },
  filter: {
    enSnowball: {
      type: 'snowball',
      language: 'English',
    },
  },
};

export const keywordField: T.MappingProperty = { type: 'keyword' };
export const textField: T.MappingProperty = { type: 'text' };
export const objectField: T.MappingProperty = { type: 'object' };
export const disabledOjectField: T.MappingProperty = {
  type: 'object',
  enabled: false,
};
export const booleanField: T.MappingProperty = { type: 'boolean' };
export const integerField: T.MappingProperty = { type: 'integer' };
export const dateField: T.MappingProperty = { type: 'date' };
export const nestedField: T.MappingProperty = { type: 'nested' };
export const histogramField: T.MappingProperty = { type: 'histogram' };

export const unaggregatedStandardAnalyzerTextField: T.MappingProperty = {
  type: 'text',
  analyzer: 'unaggregatedStandardAnalyzer',
};

export const searchableAggregatedKeywordAnalyzerField: T.MappingProperty = {
  type: 'keyword',
  fields: {
    search: {
      type: 'text',
      analyzer: 'aggregatedKeywordAnalyzer',
    },
  },
};

export const searchableAggregatedSimpleKeywordAnalyzerField: T.MappingProperty =
  {
    type: 'keyword',
    fields: {
      search: {
        type: 'text',
        analyzer: 'aggregatedSimpleKeywordAnalyzer',
      },
    },
  };

export const suggestSearchableAggregatedKeywordAnalyzerField: T.MappingProperty =
  {
    type: 'keyword',
    fields: {
      search: {
        type: 'text',
        analyzer: 'aggregatedKeywordAnalyzer',
      },
      suggest: {
        type: 'search_as_you_type',
        analyzer: 'suggestAnalyzer',
      },
    },
  };

export const suggestUnaggregatedStandardAnalyzerField: T.MappingProperty = {
  type: 'text',
  analyzer: 'unaggregatedStandardAnalyzer',
  fields: {
    suggest: {
      type: 'search_as_you_type',
      analyzer: 'suggestAnalyzer',
    },
  },
};
