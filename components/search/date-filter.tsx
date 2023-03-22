'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getBooleanValue } from '@/util/various';
import { ChevronsUpDown, Plus, X } from 'lucide-react';

import type { AggOption } from '@/types/aggOption';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [realFromDate, setRealFromDate] = useState('');
  const [realToDate, setRealToDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const displayName = dict['index.collections.date'];
  const fromDateName = dict['index.collections.date.from'];
  const toDateName = dict['index.collections.date.to'];

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      setRealFromDate(fromDate);
      setRealToDate(toDate);
    }, 800);
    return () => clearTimeout(debounceQuery);
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!realFromDate || !realToDate) return;
    const updatedParams = new URLSearchParams(params);
    if (realFromDate) updatedParams.set('startDate', realFromDate);
    if (realToDate) updatedParams.set('endDate', realToDate);
    updatedParams.delete('p');
    console.log('date go: ' + realFromDate + ' ' + realToDate);
    router.push(`${pathname}?${updatedParams}`);
  }, [realFromDate, realToDate, params, pathname, router]);

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
              name="fromDate"
              placeholder={'YYYY'}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-24"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="email">
              {toDateName}
            </Label>
            <Input
              name="toDate"
              placeholder={'YYYY'}
              onChange={(e) => setToDate(e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
