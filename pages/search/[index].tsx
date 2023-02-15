import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Head from "next/head"
import { Layout } from "@/components/layout/layout"
import { ItemCard } from "@/components/search/item-card";
import { ObjectCard } from "@/components/search/object-card";
import { TermCard } from "@/components/search/term-card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { SearchAgg } from "@/components/search/search-agg"
import { SearchPagination } from "@/components/search/search-pagination";
import { indicesMeta, getSearchParams } from "@/util/search.js";
import { search } from "@/util/elasticsearch.js";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function SearchPage({ ssrData }) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Search State:
  const [previousSearchParamsStr, setPreviousSearchParamsStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [p, setP] = useState(0);
  const [size, setSize] = useState('');
  const [filters, setFilters] = useState({});
  const [filterArr, setFilterArr] = useState([]);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [onView, setOnView] = useState(false);
  const [isUnrestricted, setIsUnrestricted] = useState(false);
  // Result State:
  const [items, setItems] = useState([]);
  const [terms, setTerms] = useState([]);
  const [apiError, setApiError] = useState('');
  const [options, setOptions] = useState({});
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // UI State:
  const [isMobileFilter, setIsMobileFilter] = useState(false);
  const [isShowFilters, setIsShowFilters] = useState(false);

  function getApiUrl() {
    const apiParams = new URLSearchParams(searchParams);
    return `/api/search/collections?${apiParams}`
  }

  function pushRouteWithParams(newParams) {
    //declare const transitionOptions: TransitionOptions;
    const debouncePush = setTimeout(() => {
      const updatedParams = new URLSearchParams(searchParams);
      for (const [name, value] of Object.entries(newParams)) {
        if (value) updatedParams.set(name, value.toString());
        else updatedParams.delete(name)
      }
      updatedParams.delete('index')
      router.push(`${pathname}?${updatedParams}`)
    }, 200);
    return () => clearTimeout(debouncePush);
  }

  useEffect(() => {
    const currentSearchParams = getSearchParams(searchParams);
    const searchParamsStr = JSON.stringify(currentSearchParams);
    if (previousSearchParamsStr === searchParamsStr) return;
    setPreviousSearchParamsStr(searchParamsStr);
    setIndex(currentSearchParams.index);
    setQ(currentSearchParams.q);
    setQuery(currentSearchParams.q);
    setP(currentSearchParams.p);
    setSize(currentSearchParams.size);
    setFilters(currentSearchParams.filters);
    setFilterArr(Object.entries(currentSearchParams.filters));
    setHasPhoto(currentSearchParams.hasPhoto);
    setOnView(currentSearchParams.onView);
    setIsUnrestricted(currentSearchParams.isUnrestricted);
    const apiParams = new URLSearchParams(searchParams);
    setIsLoading(true)
    console.log(`FETCH: /api/search/collections?${apiParams}`)
    fetch(`/api/search/collections?${apiParams}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setItems(data?.data || []);
        setTerms(data?.terms || []);
        setApiError(data?.error || '');
        setOptions(data?.options || {});
        setCount(data?.metadata?.count || 0);
        setTotalPages(data?.metadata?.pages || 0);
        setIsLoading(false);
      })
  }, [searchParams, previousSearchParamsStr]);

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      if (query !== q)
        pushRouteWithParams({ q: query, p: null });
    }, 400);
    return () => clearTimeout(debounceQuery);
  }, [query, q]);

  useEffect(() => {
    pushRouteWithParams({
      p: null, hasPhoto, onView, isUnrestricted
    });
  }, [hasPhoto, onView, isUnrestricted]);

  function updatePageIndex(p) {
    setP(p);
    pushRouteWithParams({ p });
  }

  function updatePageSize(size) {
    setSize(size);
    pushRouteWithParams({ size, p: null });
  }

  function changeIndex(newIndex: string) {
    if (newIndex !== index && newIndex !== 'collections') setIsShowFilters(false);
    if (newIndex === 'collections') router.push(`/search/${newIndex}?hasPhoto=true${q ? `&q=${q}` : ''}`)
    else router.push(`/search/${newIndex}?${q ? `q=${q}` : ''}`)
  }

  function setFilter(name: string, key: string, checked) {
    if (checked) pushRouteWithParams({ [name]: key, p: null });
    else pushRouteWithParams({ [name]: null, p: null });
  }

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
          <Button
            variant={index === 'all' ? 'outline' : 'ghost'}
            className="text-lg"
            onClick={() => changeIndex('all')}
            disabled={isLoading}
          >
            All
          </Button>
          <Button
            variant={index === 'content' ? 'outline' : 'ghost'}
            className="text-lg"
            onClick={() => changeIndex('content')}
            disabled={isLoading}
          >
            Pages
          </Button>
          <Button
            variant={index === 'collections' ? 'outline' : 'ghost'}
            className="text-lg"
            onClick={() => changeIndex('collections')}
            disabled={isLoading}
          >
            Collection
          </Button>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="grow">
            <Input name="query" placeholder="Search" defaultValue={q} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {
            index === 'collections' && (
              <div className="flex flex-wrap gap-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onView"
                    onCheckedChange={(checked) => setOnView(checked ? true : false)}
                    checked={onView}
                  />
                  <label
                    htmlFor="onView"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    On View
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPhoto"
                    onCheckedChange={(checked) => setHasPhoto(checked ? true : false)}
                    checked={hasPhoto}
                  />
                  <label
                    htmlFor="hasPhoto"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Has Photo
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isUnrestricted"
                    onCheckedChange={(checked) => setIsUnrestricted(checked ? true : false)}
                    checked={isUnrestricted}
                  />
                  <label
                    htmlFor="isUnrestricted"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Open Access
                  </label>
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
                      <SearchAgg key={i} index={index} agg={agg} options={options[agg.name]} filters={filters} checked={false} onChangeHandler={setFilter} />
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
                    <SearchAgg key={i} index={index} agg={agg} options={options[agg.name]} filters={filters} checked={false} onChangeHandler={setFilter} />
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
              index={index}
              count={count}
              p={p}
              size={size}
              totalPages={totalPages}
              isShowFilters={isShowFilters}
              onPageChangeHandler={updatePageIndex}
              onSizeChangeHandler={updatePageSize}
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
                <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-3 md:pb-6 lg:grid-cols-4">
                  {
                    terms?.length > 0 && terms.map(
                      (term, i) =>
                        term && (
                          <TermCard term={term} />
                        )
                    )
                  }
                </div>
              )
            }
            <div className="relative grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:pb-10 lg:grid-cols-3">
              {
                isLoading && (
                  <div className="absolute z-10 flex h-full w-full items-center justify-center bg-white dark:bg-neutral-900 bg-opacity-50 dark:bg-opacity-50">
                  </div>
                )
              }
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
              onPageChangeHandler={updatePageIndex}
              onSizeChangeHandler={updatePageSize}
            />
          </div>
        </div>

      </section>
    </Layout >
  )
}

export async function getServerSideProps(context) {
  const data = await search(context.query);
  return { props: { ssrData: data } }
}