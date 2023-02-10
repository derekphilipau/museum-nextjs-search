"use client"
import {useEffect, useState} from "react";
import Head from "next/head"
import useSWR from 'swr'
import { Layout } from "@/components/layout/layout"
import { ItemCard } from "@/components/search/item-card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { SearchFilter } from "@/components/search/search-filter"
import { SearchPagination } from "@/components/search/search-pagination";

const fetcher = (...args) => fetch(...args).then(res => res.json())
const PAGE_SIZE = 24;

export default function Search() {
  const [query, setQuery] = useState('');
  const [realQuery, setRealQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      setRealQuery(query)
    }, 400);
    return () => clearTimeout(debounceQuery);
  }, [query]);

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

  const { data } = useSWR(`/api/search?index=${'collections'}&page=${pageIndex}&size=${PAGE_SIZE}&query=${realQuery}`, fetcher);
  const items = data?.data || [];
  const error = data?.error || null;
  const options = data?.options || {};
  const count = data?.metadata?.count || 0;
  const totalPages = data?.metadata?.pages || 0;

  function handleFilterChange(name: string, key: string, e) {
    console.log('filter change: ', name, key)
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
      <section className="container grid sm:grid-cols-3 md:grid-cols-4 gap-6 pt-6 pb-8 md:py-10">
        <div className="sm:col-span-1 h-full space-y-6">
          <Input name="query" placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
          {indexAggregations.collections?.map(
            (filter, index) =>
              filter && (
                <SearchFilter key={index} filter={filter} options={options[filter.name]} checked={false} onChangeHandler={handleFilterChange} />
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
