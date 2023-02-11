"use client"
import {useEffect, useState} from "react";
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

const fetcher = (...args) => fetch(...args).then(res => res.json())
const PAGE_SIZE = 24;

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // Get search params from querystring
  const q = searchParams.get('q') || '';
  const pageIndex = parseInt(searchParams.get('p')) || 1;

  const filters = {};
  const classification = searchParams.get('classification') || '';
  if (classification) filters.classification = classification;
  const medium = searchParams.get('medium') || '';
  if (medium) filters.medium = medium;
  const period = searchParams.get('period') || '';
  if (period) filters.period = period;
  const dynasty = searchParams.get('dynasty') || '';
  if (dynasty) filters.dynasty = dynasty;
  const museumLocation = searchParams.get('museumLocation') || '';
  if (museumLocation) filters.museumLocation = museumLocation;
  const section = searchParams.get('section') || '';
  if (section) filters.section = section;

  const [query, setQuery] = useState('');
  const [realQuery, setRealQuery] = useState('')

  function getNewQueryParams(newParams) {
    for (const [name, value] of Object.entries(newParams)) {
      if (value) params.set(name, value);
      else params.delete(name)
    }
    params.set('index', 'collections');
    return params;
  }

  function getApiUrl() {
    const apiParams = new URLSearchParams(searchParams);
    return `/api/search?${apiParams}`
  }

  function pushQueryParam(newParams) {
    const params = getNewQueryParams(newParams);
    router.push(`${pathname}?${params}`, undefined, { shallow: true })
  }

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      setRealQuery(query)
    }, 400);
    return () => clearTimeout(debounceQuery);
  }, [query]);

  useEffect(() => {
    pushQueryParam({q: realQuery, p: 1});
  }, [realQuery]);

  function setPageIndex(p) {
    pushQueryParam({p});
  }

  function setFilter(name: string, key: string, checked) {
    console.log('yyy', checked)
    //const checked = e.target.checked;
    console.log('filter change: ', name, key, checked);
    if (checked) pushQueryParam({[name]: key});
    else pushQueryParam({[name]: null});
  }

  const indexAggregations = {
    collections: [
      { name: 'primaryConstituent', displayName: 'Maker' },
      { name: 'classification', displayName: 'Classification' },
      { name: 'medium', displayName: 'Medium' },
      { name: 'period', displayName: 'Period' },
      { name: 'dynasty', displayName: 'Dynasty' },
      { name: 'museumLocation', displayName: 'Museum Location' },
      { name: 'section', displayName: 'Section' },
    ]
  }

  const { data } = useSWR(getApiUrl(), fetcher);
  const items = data?.data || [];
  const error = data?.error || null;
  const options = data?.options || {};
  const count = data?.metadata?.count || 0;
  const totalPages = data?.metadata?.pages || 0;
  console.log('8888', data)

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
          <Input name="query" placeholder="Search" defaultValue={q} onChange={(e) => setQuery(e.target.value)} />
          {indexAggregations.collections?.map(
            (agg, index) =>
              agg && (
                <SearchAgg key={index} agg={agg} options={options[agg.name]} filters={filters} checked={false} onChangeHandler={setFilter} />
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
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl mb-2">
            Collection Search
          </h1>
          {error?.length > 0 &&
            <h3 className="text-lg text-red-800 font-extrabold leading-tight tracking-tighter mb-6">
              {error}
            </h3>
          }
          <SearchPagination count={count} pageIndex={pageIndex} totalPages={totalPages} onPageChangeHandler={setPageIndex} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-10">
            {
              items?.length > 0 && items.map(
                (item, index) =>
                  item._source && (
                    <div className="" key={index}>
                      <ItemCard item={item._source} />
                    </div>
                  )
              )
            }
          </div>
          <SearchPagination count={count} pageIndex={pageIndex} totalPages={totalPages} onPageChangeHandler={setPageIndex} />
        </div>
      </section>
    </Layout>
  )
}
