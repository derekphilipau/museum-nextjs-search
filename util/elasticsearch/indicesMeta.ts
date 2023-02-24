interface IndexMeta {
  aggs: {
    name: string;
    displayName: string;
  }[];
}
interface IndicesMeta {
  [index: string]: IndexMeta;
}

export const indicesMeta: IndicesMeta = {
  collections: {
    aggs: [
      { name: 'primaryConstituent', displayName: 'Maker' },
      { name: 'classification', displayName: 'Classification' },
      { name: 'medium', displayName: 'Medium' },
      { name: 'collections', displayName: 'Collection' },
      { name: 'period', displayName: 'Period' },
      { name: 'dynasty', displayName: 'Dynasty' },
      {
        name: 'primaryGeographicalLocationContinent',
        displayName: 'Continent',
      },
      { name: 'primaryGeographicalLocationCountry', displayName: 'Country' },
      { name: 'primaryGeographicalLocation', displayName: 'Location' },
      { name: 'museumLocation', displayName: 'Museum Location' },
      { name: 'exhibitions', displayName: 'Exhibitions' },
      { name: 'section', displayName: 'Section' },
    ],
  },
  content: {
    aggs: [],
  },
};
