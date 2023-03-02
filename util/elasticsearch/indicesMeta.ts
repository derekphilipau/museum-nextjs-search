/**
 * Metadata for each index.
 */

/**
 * The metadata for each index.
 *
 * @property [index] - The name of the index.
 * @property [index].aggs - The aggregations that are available for this index.
 */
interface IndicesMeta {
  [index: string]: {
    aggs: string[];
  };
}

/**
 * The metadata for each index.
 *
 * @property collections - The metadata for the collections index.
 * @property content - The metadata for the content index.
 */
export const indicesMeta: IndicesMeta = {
  collections: {
    aggs: [
      'primaryConstituent',
      'classification',
      'medium',
      'collections',
      'period',
      'dynasty',
      'primaryGeographicalLocationContinent',
      'primaryGeographicalLocationCountry',
      'primaryGeographicalLocation',
      'museumLocation',
      'exhibitions',
      'section',
    ],
  },
  content: {
    aggs: [],
  },
  archives: {
    aggs: [
      'subject',
      'language',
      'publisher',
    ],
  },
};
