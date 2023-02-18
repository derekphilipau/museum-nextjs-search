"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { indicesMeta } from "@/util/search.js";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { getBooleanValue } from "@/util/search";
import { SearchAgg } from "@/components/search/search-agg";

interface SearchFiltersProps {
  index: string,
  params: any,
  options: any,
  filters: any
}

export function SearchFilters({ index, params, options, filters }: SearchFiltersProps) {
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
        >
          <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
          Hide Filters
        </Button>
      </div>
      {indicesMeta.collections?.aggs?.map(
        (agg, i) =>
          agg && options[agg.name]?.length > 0 && (
            <SearchAgg index={index} params={params} key={i} agg={agg} options={options[agg.name]} filters={filters} />
          )
      )}
    </>
  )
}
