

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

export function getSearchParamsFromQuery(query) {
  const index = query.index || 'collections';
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
  const index = searchParams.get('index') || 'collections';
  const q = searchParams.get('q') || '';
  const p = parseInt(searchParams.get('p')) || 1;
  const isUnrestricted = searchParams.get('isUnrestricted') === 'true';
  
  const filters = {};
  if (Array.isArray(indicesMeta[index]?.aggs)) {
    for (const agg of indicesMeta[index].aggs) {
      console.log('checking ' + agg.name)
      if (searchParams.has(agg.name)) {
        console.log('search params has ' + agg.name + ' = ' + searchParams.get(agg.name))
        filters[agg.name] = searchParams.get(agg.name) || '';
      }
    }  
  }
  return { index, q, p, isUnrestricted, filters }
}

export function getNewQueryParams(params, newParams) {
  for (const [name, value] of Object.entries(newParams)) {
    console.log('push: ' + name + ' val: ' + value)
    if (value) params.set(name, value);
    else params.delete(name)
  }
  params.set('index', 'collections'); // TODO
  return params;
}