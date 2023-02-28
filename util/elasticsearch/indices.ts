import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from './settings';

export const collections: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      type: S.keywordField,
      url: S.keywordField,
      id: S.keywordField,
      title: S.suggestUnaggregatedStandardAnalyzerField,
      description: S.unaggregatedStandardAnalyzerTextField,
      searchText: S.unaggregatedStandardAnalyzerTextField,
      keywords: S.unaggregatedStandardAnalyzerTextField,
      boostedKeywords: S.unaggregatedStandardAnalyzerTextField,
      image: S.keywordField,
      imageAlt: S.keywordField,
      images: S.objectField,
      accessionNumber: S.searchableAggregatedSimpleKeywordAnalyzerField,
      accessionDate: S.dateField,
      date: S.textField,
      startDate: S.dateField,
      endDate: S.dateField,
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
      constituents: S.unaggregatedStandardAnalyzerTextField,
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
      index: S.keywordField,
      field: S.keywordField,
      value: S.suggestSearchableAggregatedKeywordAnalyzerField,
      description: S.textField,
      count: S.integerField,
    },
  },
};
