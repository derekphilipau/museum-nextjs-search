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
      { name: 'exhibitions', displayName: 'Exhibitions' },
      { name: 'section', displayName: 'Section' },
    ]
  },
  content: {
    aggs: []
  }
}

export function getSearchParamsFromQuery(query) {
  const index = query?.index || 'all';
  const q = query?.q || '';
  const p = parseInt(query?.p) || 1;
  const size = query?.size || '24';
  const isUnrestricted = getBooleanValue(query?.isUnrestricted);
  const hasPhoto = getBooleanValue(query?.hasPhoto);
  const onView = getBooleanValue(query?.onView);
  const filters = {};
  if (query && Array.isArray(indicesMeta[index]?.aggs)) {
    for (const agg of indicesMeta[index].aggs) {
      if (query[agg.name]) {
        filters[agg.name] = query[agg.name] || '';
      }
    }  
  }
  return { index, q, p, size, isUnrestricted, hasPhoto, onView, filters }
}

export function getBooleanValue(x) {
  if (typeof x === 'boolean') return x;
  if (typeof x === 'string') return x === 'true';
  return false;
}