import * as T from '@elastic/elasticsearch/lib/api/types';

const index: T.IndicesIndexSettings = {
  number_of_shards: 1,
  number_of_replicas: 1,
};

const analysis: T.IndicesIndexSettingsAnalysis = {
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
    articleCharFilter: {
      type: 'pattern_replace',
      pattern:
        "(^[Ddol]') |(^(van der|van|de la|de|du|da|di|le|la) )|( [dol]')",
      replacement: ' ',
    },
  },
  filter: {
    enSnowball: {
      type: 'snowball',
      language: 'English',
    },
  },
};

export const collections: T.IndicesIndexSettings = {
  settings: {
    index,
    analysis,
  },
  mappings: {
    properties: {
      type: {
        type: 'keyword',
      },
      url: {
        type: 'keyword',
      },
      id: {
        type: 'keyword',
      },
      title: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
        fields: {
          suggest: {
            type: 'search_as_you_type',
            analyzer: 'suggestAnalyzer',
          },
        },
      },
      description: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      searchText: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      keywords: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      boostedKeywords: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      image: {
        type: 'keyword',
      },
      imageAlt: {
        type: 'keyword',
      },
      images: {
        type: 'object',
      },
      accessionNumber: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedSimpleKeywordAnalyzer',
          },
        },
      },
      accessionDate: {
        type: 'date',
      },
      date: {
        type: 'text',
      },
      startDate: {
        type: 'date',
      },
      endDate: {
        type: 'date',
      },
      period: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      dynasty: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      provenance: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      medium: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      dimensions: {
        type: 'text',
      },
      edition: {
        type: 'text',
      },
      portfolio: {
        type: 'text',
      },
      markings: {
        type: 'text',
      },
      signed: {
        type: 'text',
      },
      inscribed: {
        type: 'text',
      },
      creditLine: {
        type: 'text',
      },
      copyright: {
        type: 'text',
      },
      classification: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      publicAccess: {
        type: 'boolean',
      },
      copyrightRestricted: {
        type: 'boolean',
      },
      highlight: {
        type: 'boolean',
      },
      section: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      museumLocation: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      rightsType: {
        type: 'keyword',
      },
      labels: {
        type: 'object',
        enabled: false,
      },
      primaryConstituent: {
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
      },
      primaryConstituentDates: {
        type: 'keyword',
      },
      primaryConstituentRole: {
        type: 'keyword',
      },
      constituents: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      collections: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      exhibitions: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      geographicalLocations: {
        type: 'object',
      },
      primaryGeographicalLocationContinent: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      primaryGeographicalLocationCountry: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      primaryGeographicalLocation: {
        type: 'keyword',
        fields: {
          search: {
            type: 'text',
            analyzer: 'aggregatedKeywordAnalyzer',
          },
        },
      },
      primaryGeographicalLocationType: {
        type: 'keyword',
      },
    },
  },
};

export const content: T.IndicesIndexSettings = {
  settings: {
    index,
    analysis,
  },
  mappings: {
    properties: {
      type: {
        type: 'keyword',
      },
      url: {
        type: 'keyword',
      },
      id: {
        type: 'keyword',
      },
      title: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
        fields: {
          suggest: {
            type: 'search_as_you_type',
            analyzer: 'suggestAnalyzer',
          },
        },
      },
      description: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      searchText: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      keywords: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      boostedKeywords: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      constituents: {
        type: 'text',
        analyzer: 'unaggregatedStandardAnalyzer',
      },
      image: {
        type: 'keyword',
      },
      imageAlt: {
        type: 'keyword',
      },
      date: {
        type: 'text',
      },
      startDate: {
        type: 'date',
      },
      endDate: {
        type: 'date',
      },
    },
  },
};

export const terms: T.IndicesIndexSettings = {
  settings: {
    index,
    analysis,
  },
  mappings: {
    properties: {
      index: {
        type: 'keyword',
      },
      field: {
        type: 'keyword',
      },
      value: {
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
      },
      description: {
        type: 'text',
      },
      count: {
        type: 'integer',
      },
    },
  },
};