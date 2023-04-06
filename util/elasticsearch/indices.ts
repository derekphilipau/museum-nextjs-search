import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from './settings';

const baseDocument: Record<T.PropertyName, T.MappingProperty> = {
  type: S.keywordField,
  url: S.keywordField,
  id: S.keywordField,
  title: S.suggestUnaggregatedStandardAnalyzerField,
  description: S.unaggregatedStandardAnalyzerTextField,
  searchText: S.unaggregatedStandardAnalyzerTextField,
  keywords: S.unaggregatedStandardAnalyzerTextField,
  boostedKeywords: S.unaggregatedStandardAnalyzerTextField,
  constituents: S.unaggregatedStandardAnalyzerTextField,
  image: S.keywordField,
  imageAlt: S.keywordField,
  date: S.textField,
  startDate: S.dateField,
  endDate: S.dateField,
};

export const collections: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      ...baseDocument,
      imageHistogram: S.denseVectorHistogramField,
      images: S.objectField,
      dominantColorsHsl: S.disabledOjectField,
      accessionNumber: S.searchableAggregatedSimpleKeywordAnalyzerField,
      accessionDate: S.dateField,
      period: S.searchableAggregatedKeywordAnalyzerField,
      dynasty: S.searchableAggregatedKeywordAnalyzerField,
      provenance: S.unaggregatedStandardAnalyzerTextField,
      medium: S.searchableAggregatedKeywordAnalyzerField,
      dimensions: S.textField,
      edition: S.textField,
      portfolio: S.textField,
      markings: S.textField,
      signed: S.textField,
      inscribed: S.textField,
      creditLine: S.textField,
      copyright: S.textField,
      classification: S.searchableAggregatedKeywordAnalyzerField,
      publicAccess: S.booleanField,
      copyrightRestricted: S.booleanField,
      highlight: S.booleanField,
      section: S.searchableAggregatedKeywordAnalyzerField,
      museumLocation: S.searchableAggregatedKeywordAnalyzerField,
      rightsType: S.keywordField,
      labels: S.disabledOjectField,
      primaryConstituent: S.suggestSearchableAggregatedKeywordAnalyzerField,
      primaryConstituentDates: S.keywordField,
      primaryConstituentRole: S.keywordField,
      collections: S.searchableAggregatedKeywordAnalyzerField,
      exhibitions: S.searchableAggregatedKeywordAnalyzerField,
      geographicalLocations: S.objectField,
      primaryGeographicalLocationContinent:
        S.searchableAggregatedKeywordAnalyzerField,
      primaryGeographicalLocationCountry:
        S.searchableAggregatedKeywordAnalyzerField,
      primaryGeographicalLocation: S.searchableAggregatedKeywordAnalyzerField,
      primaryGeographicalLocationType: S.keywordField,
    },
  },
};

export const content: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      ...baseDocument,
    },
  },
};

export const archives: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      ...baseDocument,
      accessionNumber: S.searchableAggregatedSimpleKeywordAnalyzerField,
      primaryConstituent: S.searchableAggregatedSimpleKeywordAnalyzerField,
      subject: S.searchableAggregatedSimpleKeywordAnalyzerField,
      language: S.searchableAggregatedSimpleKeywordAnalyzerField,
      publisher: S.keywordField,
      format: S.textField,
      rights: S.textField,
      relation: S.keywordField,
    },
  },
};

export const terms: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      source: S.keywordField,
      sourceId: S.keywordField,
      sourceType: S.keywordField,
      field: S.keywordField,
      value: S.unaggregatedStandardAnalyzerTextField,
      preferred: S.unaggregatedStandardAnalyzerTextField,
      alternates: S.unaggregatedStandardAnalyzerTextField,
      summary: S.textField,
      description: S.textField,
    },
  },
};
