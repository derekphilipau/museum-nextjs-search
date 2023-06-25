'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  sortField: string;
  sortOrder: string;
  isShowFilters: boolean;
  layout: string;
  card: string;
  isShowViewOptions: boolean;
}

export function SearchPagination({
  index,
  params,
  count,
  p,
  size,
  totalPages,
  sortField,
  sortOrder,
  isShowFilters,
  layout,
  card,
  isShowViewOptions,
}: SearchPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dict = getDictionary();

  const showExperimental = false;

  function pageClick(newPage) {
    const updatedParams = new URLSearchParams(params);
    if (newPage > 1) updatedParams.set('p', newPage + '');
    else updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
    window.scroll(0, 0);
  }

  function sizeChange(value) {
    const updatedParams = new URLSearchParams(params);
    if (value && value != '24') updatedParams.set('size', value);
    else updatedParams.delete('size');
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
    window.scroll(0, 0);
  }

  function sortBy(field: string, order: string = 'asc') {
    const updatedParams = new URLSearchParams(params);
    if (!field || (field === sortField && order === sortOrder)) {
      updatedParams.delete('sf');
      updatedParams.delete('so');
    } else {
      updatedParams.set('sf', field);
      updatedParams.set('so', order);
    }
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
    window.scroll(0, 0);
  }

  function clickShowFilters() {
    const updatedParams = new URLSearchParams(params);
    updatedParams.set('f', 'true');
    router.push(`${pathname}?${updatedParams}`);
  }

  function clickChangeLayout(layout: string) {
    const updatedParams = new URLSearchParams(params);
    updatedParams.set('layout', layout);
    router.push(`${pathname}?${updatedParams}`);
  }

  function clickChangeSearchType(
    name: string,
    value: string,
    isDelete = false
  ) {
    const updatedParams = new URLSearchParams(params);
    if (isDelete) updatedParams.delete(name);
    else updatedParams.set(name, value);
    router.push(`${pathname}?${updatedParams}`);
  }

  function sortDropdownMenuItem(
    fieldName: string,
    order: string,
    dictKey: string
  ) {
    const label = dict[`search.sort.${fieldName}.${order}`];
    let mySortField = sortField;
    let mySortOrder = sortOrder;
    if (!sortField && !sortOrder) {
      mySortField = 'startDate'; // Default order
      mySortOrder = 'desc';
    }

    return (
      <DropdownMenuItem
        onClick={() => sortBy(fieldName, order)}
        disabled={mySortField === fieldName && mySortOrder === order}
      >
        {order === 'asc' ? (
          <Icons.arrowDown className="mr-2 h-5 w-5" />
        ) : (
          <Icons.arrowUp className="mr-2 h-5 w-5" />
        )}
        <span>{label}</span>
        {fieldName === mySortField && mySortOrder === order && (
          <Icons.check className="ml-2 h-5 w-5" />
        )}
      </DropdownMenuItem>
    );
  }

  return (
    <nav
      className="items-center justify-between gap-x-4 sm:flex"
      aria-label={dict['button.pagination']}
    >
      <div className="flex items-center justify-start gap-x-2">
        {isShowViewOptions && (
          <>
            {!isShowFilters &&
              (index === 'collections' || index === 'archives') && (
                <div className="hidden sm:block">
                  <Button
                    onClick={() => clickShowFilters()}
                    variant="ghost"
                    size="sm"
                    aria-label={dict['search.showFilters']}
                  >
                    <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
                    {dict['search.showFilters']}
                  </Button>
                </div>
              )}
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => clickChangeSearchType('layout', 'grid')}
                      variant="ghost"
                      size="sm"
                      disabled={layout === 'grid'}
                      aria-label={dict['search.layoutGrid']}
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
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => clickChangeSearchType('layout', 'list')}
                      variant="ghost"
                      size="sm"
                      disabled={layout === 'list'}
                      aria-label={dict['search.layoutList']}
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
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={dict['search.cardSwatch']}
                  >
                    <Icons.arrowUpDown className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>
                    {dict['search.sort.label']}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {sortDropdownMenuItem(
                      'startDate',
                      'asc',
                      'artwork.field.date'
                    )}
                    {sortDropdownMenuItem(
                      'startDate',
                      'desc',
                      'artwork.field.date'
                    )}
                    {sortDropdownMenuItem(
                      'title',
                      'asc',
                      'baseDocument.field.title'
                    )}
                    {sortDropdownMenuItem(
                      'title',
                      'desc',
                      'baseDocument.field.title'
                    )}
                    {sortDropdownMenuItem(
                      'primaryConstituent.name',
                      'asc',
                      'artwork.field.primaryConstituent.name'
                    )}
                    {sortDropdownMenuItem(
                      'primaryConstituent.name',
                      'desc',
                      'artwork.field.primaryConstituent.name'
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {showExperimental && (
              <>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            clickChangeSearchType(
                              'card',
                              'swatch',
                              card === 'swatch'
                            )
                          }
                          variant={card === 'swatch' ? 'default' : 'ghost'}
                          size="sm"
                          aria-label={dict['search.cardSwatch']}
                        >
                          <Icons.paintbrush2 className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dict['search.cardSwatch']}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            clickChangeSearchType(
                              'card',
                              'palette',
                              card === 'palette'
                            )
                          }
                          variant={card === 'palette' ? 'default' : 'ghost'}
                          size="sm"
                          aria-label={dict['search.cardPalette']}
                        >
                          <Icons.palette className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dict['search.cardPalette']}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            clickChangeSearchType(
                              'card',
                              'color',
                              card === 'color'
                            )
                          }
                          variant={card === 'color' ? 'default' : 'ghost'}
                          size="sm"
                          aria-label={dict['search.cardColor']}
                        >
                          <Icons.pipette className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dict['search.cardColor']}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
            <div className="flex w-16">
              <Select value={size} onValueChange={(value) => sizeChange(value)}>
                <SelectTrigger
                  className="w-[180px]"
                  aria-label={dict['button.resultsPerPage']}
                >
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
          aria-label={dict['search.previous']}
        >
          <Icons.chevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
          {dict['search.previous']}
        </Button>
        <Button
          disabled={p >= totalPages}
          onClick={() => pageClick(p + 1)}
          variant="ghost"
          size="sm"
          aria-label={dict['search.next']}
        >
          {dict['search.next']}
          <Icons.chevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
