'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SearchPaginationProps {
  index: string;
  params: any;
  count: number;
  p: number;
  size: string;
  totalPages: number;
  isShowFilters: boolean;
  layout: string;
  isShowViewOptions: boolean;
}

export function SearchPagination({
  index,
  params,
  count,
  p,
  size,
  totalPages,
  isShowFilters,
  layout,
  isShowViewOptions,
}: SearchPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dict = getDictionary();
  const [originalIsShowFilters, setOriginalIsShowFilters] =
    useState(isShowFilters);
  const [originalPage, setOriginalPage] = useState(p);
  const [originalSize, setOriginalSize] = useState(size);
  const [originalLayout, setOriginalLayout] = useState(layout);

  function pageClick(newPage) {
    console.log('pagination go: ' + originalPage + ' new: ' + newPage);
    if (originalPage !== newPage) {
      setOriginalPage(newPage); // Make sure we remember the most recent value
      const updatedParams = new URLSearchParams(params);
      if (newPage > 1) updatedParams.set('p', newPage + '');
      else updatedParams.delete('p');
      router.push(`${pathname}?${updatedParams}`);
      window.scroll(0, 0);
    }
  }

  function sizeChange(value) {
    if (originalSize !== value) {
      console.log('size go: ' + originalSize + ' new: ' + value);
      setOriginalSize(value); // Make sure we remember the most recent value
      setOriginalPage(1);
      const updatedParams = new URLSearchParams(params);
      if (value && value != '24') updatedParams.set('size', value);
      else updatedParams.delete('size');
      updatedParams.delete('p');
      router.push(`${pathname}?${updatedParams}`);
      window.scroll(0, 0);
    }
  }

  function clickShowFilters() {
    setOriginalIsShowFilters(true); // Make sure we remember the most recent value
    const updatedParams = new URLSearchParams(params);
    updatedParams.set('f', 'true');
    router.push(`${pathname}?${updatedParams}`);
  }

  function clickChangeLayout(layout: string) {
    setOriginalLayout(layout); // Make sure we remember the most recent value
    const updatedParams = new URLSearchParams(params);
    updatedParams.set('layout', layout);
    router.push(`${pathname}?${updatedParams}`);
  }

  useEffect(() => {
    setOriginalIsShowFilters(isShowFilters);
  }, [isShowFilters]);

  useEffect(() => {
    setOriginalPage(p);
  }, [p]);

  useEffect(() => {
    setOriginalSize(size);
  }, [size]);

  return (
    <nav
      className="items-center justify-between gap-x-4 sm:flex"
      aria-label="Pagination"
    >
      <div className="flex items-center justify-start gap-x-4">
        {isShowViewOptions && (
          <>
            {!originalIsShowFilters &&
              (index === 'collections' || index === 'archives') && (
                <div className="hidden sm:block">
                  <Button
                    onClick={() => clickShowFilters()}
                    variant="ghost"
                    size="sm"
                  >
                    <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
                    {dict['search.showFilters']}
                  </Button>
                </div>
              )}
            <div className="hidden sm:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => clickChangeLayout('grid')}
                      variant="ghost"
                      size="sm"
                      disabled={layout === 'grid'}
                    >
                      <Icons.layoutGrid className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dict['search.layoutGrid']}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="hidden sm:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => clickChangeLayout('list')}
                      variant="ghost"
                      size="sm"
                      disabled={layout === 'list'}
                    >
                      <Icons.layoutList className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dict['search.layoutList']}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex w-16">
              <Select value={size} onValueChange={(value) => sizeChange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="text-xs">
          {count} {dict['search.resultsPage']} {p} {dict['search.of']}{' '}
          {totalPages}.
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-4">
        <Button
          disabled={p <= 1}
          onClick={() => pageClick(p - 1)}
          variant="ghost"
          size="sm"
        >
          <Icons.chevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
          {dict['search.previous']}
        </Button>
        <Button
          disabled={p >= totalPages}
          onClick={() => pageClick(p + 1)}
          variant="ghost"
          size="sm"
        >
          {dict['search.next']}
          <Icons.chevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
