'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { indicesMeta } from '@/util/elasticsearch/indicesMeta';

import { Icons } from '@/components/icons';
import { SearchAgg } from '@/components/search/search-agg';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './color-picker';
import { DateFilter } from './date-filter';

interface SearchFiltersProps {
  index: string;
  params: any;
  options: any;
  filters: any;
}

export function SearchFilters({
  index,
  params,
  options,
  filters,
}: SearchFiltersProps) {
  const dict = getDictionary();
  const router = useRouter();
  const pathname = usePathname();

  function hideFilters() {
    const updatedParams = new URLSearchParams(params);
    updatedParams.delete('f');
    router.push(`${pathname}?${updatedParams}`);
  }

  return (
    <>
      <div className="">
        <Button
          onClick={() => hideFilters()}
          variant="ghost"
          size="sm"
          aria-label={dict['button.hideFilters']}
        >
          <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
          {dict['search.hideFilters']}
        </Button>
      </div>
      {index === 'collections' && false && (
        <div className="color-picker">
          <ColorPicker params={params} />
        </div>
      )}
      {index === 'collections' && <DateFilter params={params} />}
      {indicesMeta.collections?.aggs?.map(
        (aggName, i) =>
          aggName &&
          options[aggName]?.length > 0 && (
            <SearchAgg
              index={index}
              params={params}
              key={i}
              aggDisplayName={dict[`index.collections.agg.${aggName}`]}
              aggName={aggName}
              options={options[aggName]}
              filters={filters}
            />
          )
      )}
    </>
  );
}
