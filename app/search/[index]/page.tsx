//import { useState } from "react";
import { ItemCard } from "@/components/search/item-card";
import { ObjectCard } from "@/components/search/object-card";
import { TermCard } from "@/components/search/term-card";
import { SearchAgg } from "@/components/search/search-agg"
import { SearchPagination } from "@/components/search/search-pagination";
import { indicesMeta, getSearchParamsFromQuery } from "@/util/search.js";
import { search } from "@/util/elasticsearch.js";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SearchQueryInput } from "@/components/search/search-query-input";
import { SearchCheckbox } from "@/components/search/search-checkbox";
import { SearchIndexButton } from "@/components/search/search-index-button";
import { SearchFilterTag } from "@/components/search/search-filter-tag";
import { SearchAggSectionMobile } from "@/components/search/search-agg-section-mobile";

export default async function Page({ params, searchParams }) {
  const cleanParams = getSearchParamsFromQuery(params, searchParams);
  const index = cleanParams?.index || 'all';
  const allParams = {index, ...searchParams};
  const p = cleanParams?.p || 1;
  const size = cleanParams?.size || 24;
  const filters = cleanParams?.filters || {};
  const filterArr = Object.entries(cleanParams?.filters || {});

  // Query Elasticsearch
  console.log('fetching2: ', cleanParams);
  const response = await search(allParams);
  const items = response?.data || [];
  const terms = response?.terms || [];
  const apiError = response?.error || '';
  const options = response?.options || {};
  const count = response?.metadata?.count || 0;
  const totalPages = response?.metadata?.pages || 0;

//  const [isShowFilters, setIsShowFilters] = useState(false);
// TODO
  let isShowFilters = false;
  function setIsShowFilters() { isShowFilters = true; }

  return (
    <section className="container pt-4 md:pt-6">
      <div className="flex flex-wrap gap-x-2 pb-2">
        <SearchIndexButton params={allParams} name='all' label='All' />
        <SearchIndexButton params={allParams} name='content' label='Pages' />
        <SearchIndexButton params={allParams} name='collections' label='Collection' />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <div className="grow">
          <SearchQueryInput params={allParams} />
        </div>
        {
          index === 'collections' && (
            <div className="flex flex-wrap gap-x-4">
              <div className="flex items-center space-x-2">
                <SearchCheckbox params={allParams} name='hasPhoto' label='Has Photo' />
              </div>
              <div className="flex items-center space-x-2">
                <SearchCheckbox params={allParams} name='onView' label='On View' />
              </div>
              <div className="flex items-center space-x-2">
                <SearchCheckbox params={allParams} name='isUnrestricted' label='Open Access' />
              </div>
            </div>
          )
        }
      </div>
      <div className="gap-6 pt-4 pb-8 sm:grid sm:grid-cols-3 md:grid-cols-4 md:py-6">
        {
          index === 'collections' && (
            <div className="h-full space-y-6 sm:col-span-1 sm:hidden">
              <SearchAggSectionMobile params={allParams} filters={filters} options={options} />
            </div>
          )
        }
        {isShowFilters && (
          <div className="hidden h-full space-y-6 sm:col-span-1 sm:block">
            <div className="">
              <Button
                onClick={() => setIsShowFilters()}
                variant='ghost'
                size="sm"
              >
                <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
                Hide Filters
              </Button>
            </div>
            {indicesMeta.collections?.aggs?.map(
              (agg, i) =>
                agg && options[agg.name]?.length > 0 && (
                  <SearchAgg params={allParams} key={i} agg={agg} options={options[agg.name]} filters={filters} />
                )
            )}
          </div>
        )}
        <div className={isShowFilters ? 'sm:col-span-2 md:col-span-3' : 'sm:col-span-3 md:col-span-4'}>

          {apiError?.length > 0 &&
            <h3 className="mb-6 text-lg font-extrabold leading-tight tracking-tighter text-red-800">
              {apiError}
            </h3>
          }

          <SearchPagination
            params={allParams}
            index={index}
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
                      <SearchFilterTag key={i} params={allParams} name={filter[0]} value={filter[1]} />
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
            params={allParams}
            index={index}
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