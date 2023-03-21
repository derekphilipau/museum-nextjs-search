import { Key } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { indicesMeta } from '@/util/elasticsearch/indicesMeta';
import { search } from '@/util/elasticsearch/search/search';
import { getBooleanValue } from '@/util/various';

import type { AggOptions } from '@/types/aggOptions';
import type { ApiResponseSearch } from '@/types/apiResponseSearch';
import type { BaseDocument } from '@/types/baseDocument';
import type { Term } from '@/types/term';
import { ArchiveCard } from '@/components/search/archive-card';
import { ContentCard } from '@/components/search/content-card';
import { ObjectCard } from '@/components/search/object-card';
import { SearchAggSectionMobile } from '@/components/search/search-agg-section-mobile';
import { SearchCheckbox } from '@/components/search/search-checkbox';
import { SearchFilterTag } from '@/components/search/search-filter-tag';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchIndexButton } from '@/components/search/search-index-button';
import { SearchPagination } from '@/components/search/search-pagination';
import { SearchQueryInput } from '@/components/search/search-query-input';
import { TermCard } from '@/components/search/term-card';

function getLayoutGridClass(layout: string) {
  if (layout === 'grid')
    return 'relative grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:pb-10 lg:grid-cols-3';
  return 'relative grid grid-cols-1 gap-6 pb-8 md:pb-10';
}

export default async function Page({ params, searchParams }) {
  const dict = getDictionary();

  const index = params?.index || 'all';
  const q = searchParams?.q || '';
  const p = parseInt(searchParams?.p) || 1;
  const size = searchParams?.size || '24';
  const isUnrestricted = getBooleanValue(searchParams?.isUnrestricted);
  const hasPhoto = getBooleanValue(searchParams?.hasPhoto);
  const onView = getBooleanValue(searchParams?.onView);
  const layout = searchParams?.layout || 'grid';

  const isShowFilters = getBooleanValue(searchParams?.f);

  const aggFilters = {};
  if (searchParams && Array.isArray(indicesMeta[index]?.aggs)) {
    for (const aggName of indicesMeta[index].aggs) {
      if (searchParams[aggName]) {
        aggFilters[aggName] = searchParams[aggName] || '';
      }
    }
  }
  const filterArr = Object.entries(aggFilters);

  // Query Elasticsearch
  const response: ApiResponseSearch = await search({ index, ...searchParams });
  const items: BaseDocument[] = response?.data || [];
  const terms: Term[] = response?.terms || [];
  const filters: Term[] = response?.filters || [];
  const apiError = response?.error || '';
  const options: AggOptions = response?.options || {};
  const count = response?.metadata?.count || 0;
  const totalPages = response?.metadata?.pages || 0;

  return (
    <section className="container pt-4 md:pt-6">
      <div className="flex flex-wrap gap-x-2 pb-2">
        <SearchIndexButton
          index={index}
          params={searchParams}
          name="all"
          label={dict['index.all']}
        />
        <SearchIndexButton
          index={index}
          params={searchParams}
          name="content"
          label={dict['index.content']}
        />
        <SearchIndexButton
          index={index}
          params={searchParams}
          name="collections"
          label={dict['index.collections']}
        />
        <SearchIndexButton
          index={index}
          params={searchParams}
          name="archives"
          label={dict['index.archives']}
        />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <div className="grow">
          <SearchQueryInput params={searchParams} />
        </div>
        {index === 'collections' && (
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center space-x-2">
              <SearchCheckbox
                params={searchParams}
                name="hasPhoto"
                value={hasPhoto}
                label={dict['search.hasPhoto']}
              />
            </div>
            <div className="flex items-center space-x-2">
              <SearchCheckbox
                params={searchParams}
                name="onView"
                value={onView}
                label={dict['search.onView']}
              />
            </div>
            <div className="flex items-center space-x-2">
              <SearchCheckbox
                params={searchParams}
                name="isUnrestricted"
                value={isUnrestricted}
                label={dict['search.openAccess']}
              />
            </div>
          </div>
        )}
      </div>
      <div className="gap-6 pt-4 pb-8 sm:grid sm:grid-cols-3 md:grid-cols-4 md:py-6">
        {index === 'collections' && (
          <div className="h-full space-y-6 sm:col-span-1 sm:hidden">
            <SearchAggSectionMobile
              index={index}
              params={searchParams}
              filters={aggFilters}
              options={options}
            />
          </div>
        )}
        {isShowFilters && (
          <div className="hidden h-full space-y-6 sm:col-span-1 sm:block">
            <SearchFilters
              index={index}
              params={searchParams}
              options={options}
              filters={aggFilters}
            />
          </div>
        )}
        <div
          className={
            isShowFilters
              ? 'sm:col-span-2 md:col-span-3'
              : 'sm:col-span-3 md:col-span-4'
          }
        >
          {apiError?.length > 0 && (
            <h3 className="mb-6 text-lg font-extrabold leading-tight tracking-tighter text-red-800">
              {apiError}
            </h3>
          )}

          {filters?.length > 0 &&
            filters.map(
              (term: Term, i: Key) =>
                term?.field === 'primaryConstituent' && (
                  <div className="mb-4">
                    <h4 className="text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
                      {dict[`index.collections.agg.${term.field}`]}
                    </h4>
                    {term.value && (
                      <h4 className="mb-2 text-2xl">{term.value}</h4>
                    )}
                    {term.summary && (
                      <p className="mb-2 text-base">{term.summary}</p>
                    )}
                    {term.description && (
                      <p className="text-sm">{term.description}</p>
                    )}
                  </div>
                )
            )}

          <SearchPagination
            index={index}
            params={searchParams}
            count={count}
            p={p}
            size={size}
            totalPages={totalPages}
            isShowFilters={isShowFilters}
            layout={layout}
            isShowViewOptions={true}
          />

          {filterArr?.length > 0 && (
            <div className="flex flex-wrap gap-x-2 pt-3">
              {filterArr?.length > 0 &&
                filterArr.map(
                  (filter, i) =>
                    filter && (
                      <SearchFilterTag
                        key={i}
                        params={searchParams}
                        name={filter[0]}
                        value={filter[1]}
                      />
                    )
                )}
            </div>
          )}
          {terms?.length > 0 && (
            <>
              <h4 className="mt-4 mb-2 text-lg text-neutral-900 dark:text-white">
                Did you mean:
              </h4>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:pb-6 lg:grid-cols-4">
                {terms?.length > 0 &&
                  terms.map(
                    (term: Term, i: Key) =>
                      term && <TermCard key={i} term={term} />
                  )}
              </div>
            </>
          )}
          <div className={getLayoutGridClass(layout)}>
            {items?.length > 0 &&
              items.map(
                (item: any, i: Key) =>
                  item && (
                    <div className="" key={i}>
                      {item.type === 'object' && (
                        <ObjectCard
                          item={item}
                          layout={layout}
                          showType={index === 'all'}
                        />
                      )}
                      {item.type === 'dc_object' && (
                        <ArchiveCard item={item} showType={index === 'all'} />
                      )}
                      {item.type === 'page' && (
                        <ContentCard
                          item={item}
                          layout={layout}
                          showType={index === 'all'}
                        />
                      )}
                    </div>
                  )
              )}
            {!(items?.length > 0) && (
              <h3 className="my-10 mb-4 text-lg md:text-xl">
                Sorry, we couldn’t find any results matching your criteria.
              </h3>
            )}
          </div>
          <SearchPagination
            index={index}
            params={searchParams}
            count={count}
            p={p}
            size={size}
            totalPages={totalPages}
            isShowFilters={isShowFilters}
            layout={layout}
            isShowViewOptions={false}
          />
        </div>
      </div>
    </section>
  );
}
