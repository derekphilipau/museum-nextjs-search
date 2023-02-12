

export const indicesMeta = {
  collections: {
    aggs: [
      { name: 'primaryConstituent', displayName: 'Maker' },
      { name: 'classification', displayName: 'Classification' },
      { name: 'medium', displayName: 'Medium' },
      { name: 'period', displayName: 'Period' },
      { name: 'dynasty', displayName: 'Dynasty' },
      { name: 'collections', displayName: 'Collections' },
      { name: 'geographicalLocations', displayName: 'Places' },
      { name: 'museumLocation', displayName: 'Museum Location' },
      { name: 'section', displayName: 'Section' },
    ]
  }
}


/*




import qs from 'qs';
import { ParsedUrlQuery } from 'querystring';
import { SearchState } from 'react-instantsearch-core';

export const createUrl = (searchState: SearchState) =>
  `/search?${qs.stringify(searchState)}`;

export const pathToSearchState = (path: string) =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

export const searchStateToRouterQuery = (searchState: SearchState) =>
  searchState ? qs.stringify(searchState) : '';

export const searchStateFromRouterQuery = (query: ParsedUrlQuery) =>
  qs.parse(qs.stringify(query));


  */