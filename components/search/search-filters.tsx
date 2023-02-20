"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { indicesMeta } from "@/util/search";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { getBooleanValue } from "@/util/various";
import { SearchAgg } from "@/components/search/search-agg";
import { getDictionary } from '@/dictionaries/dictionaries';

interface SearchFiltersProps {
  index: string,
  params: any,
  options: any,
  filters: any
}

export function SearchFilters({ index, params, options, filters }: SearchFiltersProps) {
  const dict = getDictionary();
  const router = useRouter();
  const pathname = usePathname();

  const [isShowFilters, setIsShowFilters] = useState(getBooleanValue(params?.f));
  const [myIsShowFilters, setMyIsShowFilters] = useState(getBooleanValue(params?.f));

  useEffect(() => {
    if (isShowFilters !== myIsShowFilters) {
      setIsShowFilters(myIsShowFilters); // Make sure we remember the most recent value
      const updatedParams = new URLSearchParams(params);
      if (myIsShowFilters) updatedParams.set('f', 'true');
      else updatedParams.delete('f');
      router.push(`${pathname}?${updatedParams}`)
    }
  }, [isShowFilters, myIsShowFilters, router, params, pathname]);

  return (
    <>
      <div className="">
        <Button
          onClick={() => setMyIsShowFilters(false)}
          variant='ghost'
          size="sm"
          aria-label='Hide Filters'
        >
          <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
          {dict['search.hideFilters']}
        </Button>
      </div>
      {indicesMeta.collections?.aggs?.map(
        (agg, i) =>
          agg && options[agg.name]?.length > 0 && (
            <SearchAgg index={index} params={params} key={i} aggDisplayName={agg?.displayName} aggName={agg?.name} options={options[agg.name]} filters={filters} />
          )
      )}
    </>
  )
}
