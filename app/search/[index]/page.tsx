//import { useState } from "react";
import { ItemCard } from "@/components/search/item-card";
import { ObjectCard } from "@/components/search/object-card";
import { TermCard } from "@/components/search/term-card";
import { SearchPagination } from "@/components/search/search-pagination";
import { getSearchParamsFromQuery } from "@/util/search.js";
import { search } from "@/util/elasticsearch.js";
import { SearchQueryInput } from "@/components/search/search-query-input";
import { SearchCheckbox } from "@/components/search/search-checkbox";
import { SearchIndexButton } from "@/components/search/search-index-button";
import { SearchFilterTag } from "@/components/search/search-filter-tag";
import { SearchAggSectionMobile } from "@/components/search/search-agg-section-mobile";
import { SearchFilters } from "@/components/search/search-filters";

export default async function Page({ params, searchParams }) {
  const cleanParams = getSearchParamsFromQuery(params, searchParams);
  const index = cleanParams?.index || 'all';
  const p = cleanParams?.p || 1;
  const size = cleanParams?.size || 24;
  const filters = cleanParams?.filters || {};
  const filterArr = Object.entries(cleanParams?.filters || {});
  const isShowFilters = cleanParams?.isShowFilters;

  // Query Elasticsearch
  console.log('fetching2: ', cleanParams);
  const response = await search({index, ...searchParams});
  const items = response?.data || [];
  const terms = response?.terms || [];
  const apiError = response?.error || '';
  const options = response?.options || {};
  const count = response?.metadata?.count || 0;
  const totalPages = response?.metadata?.pages || 0;

  return (
    <section className="container pt-4 md:pt-6">
      <div className="flex flex-wrap gap-x-2 pb-2">
        <SearchIndexButton index={index} params={searchParams} name='all' label='All' />
        <SearchIndexButton index={index} params={searchParams} name='content' label='Pages' />
        <SearchIndexButton index={index} params={searchParams} name='collections' label='Collection' />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <div className="grow">
          <SearchQueryInput params={searchParams} />
        </div>
        {
          index === 'collections' && (
            <div className="flex flex-wrap gap-x-4">
              <div className="flex items-center space-x-2">
                <SearchCheckbox params={searchParams} name='hasPhoto' label='Has Photo' />
              </div>
              <div className="flex items-center space-x-2">
                <SearchCheckbox params={searchParams} name='onView' label='On View' />
              </div>
              <div className="flex items-center space-x-2">
                <SearchCheckbox params={searchParams} name='isUnrestricted' label='Open Access' />
              </div>
            </div>
          )
        }
      </div>
      <div className="gap-6 pt-4 pb-8 sm:grid sm:grid-cols-3 md:grid-cols-4 md:py-6">
        {
          index === 'collections' && (
            <div className="h-full space-y-6 sm:col-span-1 sm:hidden">
              <SearchAggSectionMobile index={index} params={searchParams} filters={filters} options={options} />
            </div>
          )
        }
        {isShowFilters && (
          <div className="hidden h-full space-y-6 sm:col-span-1 sm:block">
            <SearchFilters index={index} params={searchParams} options={options} filters={filters} />
          </div>
        )}
        <div className={isShowFilters ? 'sm:col-span-2 md:col-span-3' : 'sm:col-span-3 md:col-span-4'}>
          {apiError?.length > 0 &&
            <h3 className="mb-6 text-lg font-extrabold leading-tight tracking-tighter text-red-800">
              {apiError}
            </h3>
          }

          <SearchPagination
            index={index}
            params={searchParams}
            count={count}
            p={p}
            size={size}
            totalPages={totalPages}
            isShowFilters={isShowFilters}
            />

          {filterArr?.length > 0 && (
            <div className="flex flex-wrap gap-x-2 pt-3">
              {
                filterArr?.length > 0 && filterArr.map(
                  (filter, i) =>
                    filter && (
                      <SearchFilterTag key={i} params={searchParams} name={filter[0]} value={filter[1]} />
                    )
                )
              }
            </div>
          )}
          {
            terms?.length > 0 && (
              <>
                <h4 className="mt-4 mb-2 text-lg text-neutral-900 dark:text-white">Did you mean:</h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:pb-6 lg:grid-cols-4">

                  {
                    terms?.length > 0 && terms.map(
                      (term, i) =>
                        term && (
                          <TermCard key={i} term={term} />
                        )
                    )
                  }
                </div>
              </>
            )
          }
          <div className="relative grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:pb-10 lg:grid-cols-3">
            {
              items?.length > 0 && items.map(
                (item : any, i) =>
                  item && (
                    <div className="" key={i}>
                      {
                        item.type === 'object' ? (
                          <ObjectCard item={item} />
                        ) : (
                          <ItemCard item={item} />
                        )
                      }
                    </div>
                  )
              )
            }
            {
              !(items?.length > 0) && (
                <h3 className="my-10 mb-4 text-lg md:text-xl">
                  Sorry, we couldn’t find any results matching your criteria.
                </h3>
              )
            }
          </div>
          <SearchPagination
            index={index}
            params={searchParams}
            count={count}
            p={p}
            size={size}
            totalPages={totalPages}
            isShowFilters={true}
          />
        </div>
      </div>
    </section>
  )
}