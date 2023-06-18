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
    filters: string[];
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
      'primaryConstituent.name',
      'classification',
      'medium',
      'collections',
      'period',
      'dynasty',
      'primaryGeographicalLocation.continent',
      'primaryGeographicalLocation.country',
      'primaryGeographicalLocation.name',
      'museumLocation.name',
      'exhibitions',
      'section',
    ],
    filters: [
      // not all aggs need to be filters
      'primaryConstituent.name',
      'classification',
      'medium',
      'collections',
      'period',
      'dynasty',
      'primaryGeographicalLocation.continent',
      'primaryGeographicalLocation.country',
      'primaryGeographicalLocation.name',
      'museumLocation.name',
      'exhibitions',
      'section',
      // non-agg filters:
      'isUnrestricted',
      'hasPhoto',
      'onView',
    ],
  },
  content: {
    aggs: [],
    filters: [],
  },
  archives: {
    aggs: ['primaryConstituent.name'],
    filters: ['primaryConstituent.name'],
  },
};
