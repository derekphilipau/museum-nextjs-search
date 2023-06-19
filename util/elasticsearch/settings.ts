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
export const disabledObjectField: T.MappingProperty = {
  type: 'object',
  enabled: false,
};
export const booleanField: T.MappingProperty = { type: 'boolean' };
export const integerField: T.MappingProperty = { type: 'integer' };
export const dateField: T.MappingProperty = { type: 'date' };
export const nestedField: T.MappingProperty = { type: 'nested' };
export const denseVectorHistogramField: T.MappingProperty = {
  type: 'dense_vector',
  dims: 96,
  index: true,
  similarity: 'cosine',
};
export const colorField: T.MappingProperty = {
  properties: {
    h: { type: 'float' },
    s: { type: 'float' },
    v: { type: 'float' },
  },
};

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

export const constituentObjectField: T.MappingProperty = {
  properties: {
    id: keywordField,
    name: searchableAggregatedKeywordAnalyzerField,
    prefix: keywordField,
    suffix: keywordField,
    dates: textField,
    birthYear: integerField,
    deathYear: integerField,
    nationality: keywordField,
    gender: keywordField,
    role: keywordField,
    rank: integerField,
    source: keywordField,
    sourceId: keywordField,
    wikiQid: keywordField,
    ulanId: keywordField,
  },
};

export const geographicalLocationObjectField: T.MappingProperty = {
  properties: {
    id: keywordField,
    name: searchableAggregatedKeywordAnalyzerField,
    continent: searchableAggregatedKeywordAnalyzerField,
    country: searchableAggregatedKeywordAnalyzerField,
    type: keywordField,
  },
};

export const museumLocationObjectField: T.MappingProperty = {
  properties: {
    id: keywordField,
    name: searchableAggregatedKeywordAnalyzerField,
    isPublic: booleanField,
    isFloor: booleanField,
    parentId: keywordField,
  },
};

export const imageObjectField: T.MappingProperty = {
  properties: {
    id: keywordField,
    url: keywordField,
    thumbnailUrl: keywordField,
    alt: textField,
    dominantColorsHsl: nestedField,
    histogram: denseVectorHistogramField,
    date: textField,
    view: keywordField,
    rank: integerField,
  },
};
