'use client';

import { ChangeEvent, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { ChevronsUpDown } from 'lucide-react';

import { useDebounce } from '@/util/debounce';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateFilterProps {
  params: any;
}

export function DateFilter({ params }: DateFilterProps) {
  const dict = getDictionary();
  const router = useRouter();
  const pathname = usePathname();

  const [fromDate, setFromDate] = useState(params?.startDate || '');
  const [toDate, setToDate] = useState(params?.endDate || '');
  const [isOpen, setIsOpen] = useState(false);

  const displayName = dict['index.collections.date'];
  const fromDateName = dict['index.collections.date.from'];
  const toDateName = dict['index.collections.date.to'];

  const debouncedRequest = useDebounce(() => {
    if (!fromDate && !toDate) return;
    const updatedParams = new URLSearchParams(params);
    if (fromDate) updatedParams.set('startDate', fromDate);
    else updatedParams.delete('startDate');
    if (toDate) updatedParams.set('endDate', toDate);
    else updatedParams.delete('endDate');
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
  });

  const onFromDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    debouncedRequest();
  };

  const onToDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    debouncedRequest();
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full items-center justify-between p-1"
          aria-label="Expand search filter"
        >
          <h4 className="text-sm font-semibold">{displayName}</h4>
          <div>
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle {displayName}</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full space-y-2">
        <div className="mb-2 flex flex-wrap gap-x-4">
          <div>
            <Label className="mb-2" htmlFor="email">
              {fromDateName}
            </Label>
            <Input
              className="w-20"
              name="fromDate"
              placeholder={'YYYY'}
              onChange={onFromDateChange}
              value={fromDate}
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="email">
              {toDateName}
            </Label>
            <Input
              className="w-20"
              name="toDate"
              placeholder={'YYYY'}
              onChange={onToDateChange}
              value={toDate}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
