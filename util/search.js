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

export function getSearchParamsFromQuery(params, searchParams) {
  const index = params?.index || 'all';
  const q = searchParams?.q || '';
  const p = parseInt(searchParams?.p) || 1;
  const size = searchParams?.size || '24';
  const isUnrestricted = getBooleanValue(searchParams?.isUnrestricted);
  const hasPhoto = getBooleanValue(searchParams?.hasPhoto);
  const onView = getBooleanValue(searchParams?.onView);
  const isShowFilters = getBooleanValue(searchParams?.f);
  const filters = {};
  if (searchParams && Array.isArray(indicesMeta[index]?.aggs)) {
    for (const agg of indicesMeta[index].aggs) {
      if (searchParams[agg.name]) {
        filters[agg.name] = searchParams[agg.name] || '';
      }
    }  
  }
  return { index, q, p, size, isUnrestricted, hasPhoto, onView, isShowFilters, filters }
}

export function getBooleanValue(x) {
  if (typeof x === 'boolean') return x;
  if (typeof x === 'string') return x === 'true';
  return false;
}