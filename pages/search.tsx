"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Head from "next/head"
import useSWR from 'swr'
import { Layout } from "@/components/layout/layout"
import { ItemCard } from "@/components/search/item-card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { SearchAgg } from "@/components/search/search-agg"
import { SearchPagination } from "@/components/search/search-pagination";
import { indicesMeta, getSearchParams, getSearchParamsFromQuery, getNewQueryParams } from "@/util/search.js";
import { search } from "@/util/elasticsearch.js";

const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};

export default function Search({ ssrData }) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { index, q, pageIndex, filters } = getSearchParams(searchParams);
  const [query, setQuery] = useState(q);

  function getApiUrl() {
    const apiParams = new URLSearchParams(searchParams);
    return `/api/search?${apiParams}`
  }

  function pushQueryParam(newParams) {
    const updatedParams = getNewQueryParams(params, newParams);
    router.push(`${pathname}?${updatedParams}`, undefined)
  }

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      if (query !== q)
        pushQueryParam({ q: query, p: 1 });
    }, 400);
    return () => clearTimeout(debounceQuery);
  }, [query]);

  function updatePageIndex(p) {
    pushQueryParam({ p });
  }

  function setFilter(name: string, key: string, checked) {
    if (checked) pushQueryParam({ [name]: key, p: 1 });
    else pushQueryParam({ [name]: null });
  }

  const { data, error } = useSWR(getApiUrl(), fetcher, {
    fallbackData: ssrData
  })
  const items = data?.data || [];
  const apiError = data?.error || null;
  const options = data?.options || {};
  const count = data?.metadata?.count || 0;
  const totalPages = data?.metadata?.pages || 0;

  const filterArr = Object.entries(filters);

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
      <section className="container grid sm:grid-cols-3 md:grid-cols-4 gap-6 pt-6 pb-8 md:py-10">
        <div className="sm:col-span-1 h-full space-y-6">
          {indicesMeta.collections?.aggs?.map(
            (agg, i) =>
              agg && options[agg.name]?.length > 0 && (
                <SearchAgg key={i} index={index} agg={agg} options={options[agg.name]} filters={filters} checked={false} onChangeHandler={setFilter} />
              )
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Has image
            </label>
          </div>
        </div>
        <div className="sm:col-span-2 md:col-span-3">
          <Input name="query" placeholder="Search" defaultValue={q} onChange={(e) => setQuery(e.target.value)} />
          {error?.length > 0 &&
            <h3 className="text-lg text-red-800 font-extrabold leading-tight tracking-tighter mb-6">
              {error}
            </h3>
          }
          {filterArr?.length > 0 && (
            <div className="pt-3 flex flex-wrap gap-x-2">
              {
                filterArr?.length > 0 && filterArr.map(
                  (filter, i) =>
                    filter && (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-700 py-1 pl-2.5 pr-1 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        {filter[1]}
                        <button
                          type="button"
                          className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 focus:bg-neutral-500 focus:text-white focus:outline-none"
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

          <SearchPagination count={count} pageIndex={pageIndex} totalPages={totalPages} onPageChangeHandler={updatePageIndex} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-10">
            {
              items?.length > 0 && items.map(
                (item, i) =>
                  item && (
                    <div className="" key={i}>
                      <ItemCard item={item} />
                    </div>
                  )
              )
            }
          </div>
          <SearchPagination count={count} pageIndex={pageIndex} totalPages={totalPages} onPageChangeHandler={updatePageIndex} />
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const data = await search(context.query);
  return { props: { ssrData: data } }
}