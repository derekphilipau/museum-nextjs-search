

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
  const index = query.index;
  const q = query.q || '';
  const p = parseInt(query.p) || 1;
  const filters = {};
  if (Array.isArray(indicesMeta[index]?.aggs)) {
    for (const agg of indicesMeta[index].aggs) {
      if (query[agg.name]) {
        filters[agg.name] = query[agg.name] || '';
      }
    }  
  }
  return { index, q, p, filters }
}

export function getSearchParams(searchParams) {
  const index = searchParams.get('index');
  const q = searchParams.get('q') || '';
  const p = parseInt(searchParams.get('p')) || 1;
  const size = searchParams.get('size') || '24';
  const isUnrestricted = searchParams.get('isUnrestricted') === 'true';
  const hasPhoto = searchParams.get('hasPhoto') === 'true';
  const onView = searchParams.get('onView') === 'true';
  
  const filters = {};
  if (Array.isArray(indicesMeta[index]?.aggs)) {
    for (const agg of indicesMeta[index].aggs) {
      if (searchParams.has(agg.name)) {
        filters[agg.name] = searchParams.get(agg.name) || '';
      }
    }  
  }
  return { index, q, p, size, isUnrestricted, hasPhoto, onView, filters }
}