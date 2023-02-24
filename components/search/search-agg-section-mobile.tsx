'use client';

import { useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { indicesMeta } from '@/util/elasticsearch/indicesMeta';

import { Icons } from '@/components/icons';
import { SearchAgg } from '@/components/search/search-agg';

interface SearchAggSectionMobileProps {
  index: string;
  params?: any;
  filters: any;
  options: any;
}

export function SearchAggSectionMobile({
  index,
  params,
  filters,
  options,
}: SearchAggSectionMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dict = getDictionary();

  return (
    <>
      <div className="pb-4">
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-md bg-transparent p-1 text-sm font-medium transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 dark:data-[state=open]:bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Show search filters"
        >
          {isOpen ? (
            <div className="flex w-full items-center justify-between p-1 text-sm font-semibold">
              {dict['search.hideFilters']}
              <Icons.chevronUp className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-between p-1 text-sm font-semibold">
              {dict['search.showFilters']}
              <Icons.chevronDown className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </button>
      </div>
      {isOpen &&
        indicesMeta.collections?.aggs?.map(
          (agg, i) =>
            agg &&
            options[agg.name]?.length > 0 && (
              <SearchAgg
                index={index}
                params={params}
                key={i}
                aggDisplayName={agg?.displayName}
                aggName={agg?.name}
                options={options[agg.name]}
                filters={filters}
              />
            )
        )}
    </>
  );
}
