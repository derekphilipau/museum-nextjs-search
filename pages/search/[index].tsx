import { useState } from "react";
import Head from "next/head"
import { Layout } from "@/components/layout/layout"
import { ItemCard } from "@/components/search/item-card";
import { ObjectCard } from "@/components/search/object-card";
import { TermCard } from "@/components/search/term-card";
import { SearchAgg } from "@/components/search/search-agg"
import { SearchPagination } from "@/components/search/search-pagination";
import { indicesMeta, getSearchParamsFromQuery, getBooleanValue } from "@/util/search.js";
import { search } from "@/util/elasticsearch.js";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SearchQueryInput } from "@/components/search/search-query-input";
import { SearchCheckbox } from "@/components/search/search-checkbox";
import { SearchIndexButton } from "@/components/search/search-index-button";

export default function SearchPage({ ssrQuery, ssrData }) {

  const cleanParams = getSearchParamsFromQuery(ssrQuery);
  const index = cleanParams?.index || 'all';
  const q = cleanParams?.q || '';
  const p = cleanParams?.p || 1;
  const size = cleanParams?.size || 24;
  const filters = cleanParams?.filters || {};
  const filterArr = Object.entries(cleanParams?.filters || {});

  const items = ssrData?.data || [];
  const terms = ssrData?.terms || [];
  const apiError = ssrData?.error || '';
  const options = ssrData?.options || {};
  const count = ssrData?.metadata?.count || 0;
  const totalPages = ssrData?.metadata?.pages || 0;

  // UI State:
  const [isMobileFilter, setIsMobileFilter] = useState(false);
  const [isShowFilters, setIsShowFilters] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Search : Brooklyn Museum</title>
        <meta
          name="description"
          content="Elasticsearch + Next.js Search Prototype"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container pt-4 md:pt-6">
        <div className="flex flex-wrap gap-x-2 pb-2">
          <SearchIndexButton params={ssrQuery} name='all' label='All' />
          <SearchIndexButton params={ssrQuery} name='content' label='Pages' />
          <SearchIndexButton params={ssrQuery} name='collections' label='Collection' />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="grow">
            <SearchQueryInput params={ssrQuery} />
          </div>
          {
            index === 'collections' && (
              <div className="flex flex-wrap gap-x-4">
                <div className="flex items-center space-x-2">
                  <SearchCheckbox params={ssrQuery} name='hasPhoto' label='Has Photo' />
                </div>
                <div className="flex items-center space-x-2">
                  <SearchCheckbox params={ssrQuery} name='onView' label='On View' />
                </div>
                <div className="flex items-center space-x-2">
                  <SearchCheckbox params={ssrQuery} name='isUnrestricted' label='Open Access' />
                </div>
              </div>
            )
          }
        </div>
        <div className="gap-6 pt-4 pb-8 sm:grid sm:grid-cols-3 md:grid-cols-4 md:py-6">
          {
            index === 'collections' && (
              <div className="h-full space-y-6 sm:col-span-1 sm:hidden">
                <div className="pb-4">
                  <button
                    type="button"
                    className="flex h-9 w-full items-center justify-between rounded-md bg-transparent p-1 text-sm font-medium transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 dark:data-[state=open]:bg-transparent"
                    onClick={() => setIsMobileFilter(!isMobileFilter)}
                  >
                    {isMobileFilter ? (
                      <div className="flex w-full items-center justify-between p-1 text-sm font-semibold">
                        Hide Filters
                        <Icons.chevronUp className="h-5 w-5" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="flex w-full items-center justify-between p-1 text-sm font-semibold">
                        Show Filters
                        <Icons.chevronDown className="h-5 w-5" aria-hidden="true" />
                      </div>
                    )}
                  </button>
                </div>
                {isMobileFilter && indicesMeta.collections?.aggs?.map(
                  (agg, i) =>
                    agg && options[agg.name]?.length > 0 && (
                      <SearchAgg params={ssrQuery} key={i} index={index} agg={agg} options={options[agg.name]} filters={filters} checked={false} />
                    )
                )}
              </div>
            )
          }
          {isShowFilters && (
            <div className="hidden h-full space-y-6 sm:col-span-1 sm:block">
              <div className="">
                <Button
                  onClick={() => setIsShowFilters(false)}
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
                    <SearchAgg params={ssrQuery} key={i} index={index} agg={agg} options={options[agg.name]} filters={filters} checked={false} />
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
              params={ssrQuery}
              index={index}
              count={count}
              p={p}
              size={size}
              totalPages={totalPages}
              isShowFilters={isShowFilters}
              onShowFilters={() => setIsShowFilters(true)} />

            {filterArr?.length > 0 && (
              <div className="flex flex-wrap gap-x-2 pt-3">
                {
                  filterArr?.length > 0 && filterArr.map(
                    (filter, i) =>
                      filter && (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-neutral-100 py-1 pl-2.5 pr-1 text-sm font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                        >
                          {filter[1]}
                          <button
                            type="button"
                            className="ml-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 focus:bg-neutral-500 focus:text-white focus:outline-none"
                            onClick={() => setFilter(filter[0], '', false)}
                          >
                            <span className="sr-only">Remove option</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
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
                  (item, i) =>
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
              count={count}
              p={p}
              size={size}
              totalPages={totalPages}
              isShowFilters={true}
            />
          </div>
        </div>

      </section>
    </Layout >
  )
}

export async function getServerSideProps(context) {
  const data = await search(context.query);
  return { props: { ssrQuery: context.query, ssrData: data } }
}