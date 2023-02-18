"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import { Agg } from "@/types/agg"
import { AggOption } from "@/types/aggOption";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SearchAggProps {
  params: any,
  index?: string,
  agg?: Agg,
  options?: AggOption[],
  filters?: any,
  checked?: boolean,
}

export function SearchAgg({ params, index, agg, options, filters }: SearchAggProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [realQuery, setRealQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);

  function checkboxChange(key, checked) {
    const option = options.find(o => o.key === key);
    if (option) {
      console.log('agg go: ' + agg.name + ' key: ' + key + ' checked: ' + checked)
      const updatedParams = new URLSearchParams(params);
      if (checked) updatedParams.set(agg.name, key);
      else updatedParams.delete(agg.name);
      updatedParams.delete('p');
      updatedParams.delete('index')
      router.push(`${pathname}?${updatedParams}`)
    }
  }

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      setRealQuery(query)
    }, 400);
    return () => clearTimeout(debounceQuery);
  }, [query]);

  useEffect(() => {
    console.log('updated option: ' + realQuery)
    setLoading(true)
    if (realQuery?.length < 3) {
      setSearchOptions([]);
      return;
    }
    else {
      fetch(`/api/options?index=${index}&field=${agg.name}&q=${realQuery}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('got options', data)
          if (data?.length > 0) setSearchOptions(data)
          else setSearchOptions([])
          setLoading(false)
        })
    }
  }, [realQuery]);

  let hasCheckedValues = false;
  let checked = []
  if (agg.name in filters) {
    checked.push(filters[agg.name])
    if (!hasCheckedValues
      && options?.length > 0
      && options.filter(o => o.key === filters[agg.name]).length > 0) {
      hasCheckedValues = true;
    }
  }

  const [isOpen, setIsOpen] = useState(hasCheckedValues)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 flex items-center justify-between w-full">
          <h4 className="text-sm font-semibold">
            {agg.displayName}
          </h4>
          <div>
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle {agg.displayName}</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 w-full">
        <div className="mb-2">
          <Input name="query" placeholder={`Search ${agg.displayName}`} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {searchOptions?.length > 0 && searchOptions?.map(
          (option, index) =>
            option && (
              <div className="flex items-center space-x-2" key={`agg-${agg.name}-${index}`}>
                <Checkbox
                  id={`terms-${agg.name}-${index}`}
                  onCheckedChange={(checked) => checkboxChange(option.key, checked)}
                  defaultChecked={checked.includes(option.key)}
                />
                <label
                  htmlFor={`terms-${agg.name}-${index}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.key}{option.doc_count ? ` (${option.doc_count})` : ''}
                </label>
              </div>
            )
        )}
        {searchOptions?.length === 0 && options?.length > 0 && options?.map(
          (option, index) =>
            option && (
              <div className="flex items-center space-x-2" key={`agg-${agg.name}-${index}`}>
                <Checkbox
                  id={`terms-${agg.name}-${index}`}
                  onCheckedChange={(checked) => checkboxChange(option.key, checked)}
                  defaultChecked={checked.includes(option.key)}
                />
                <label
                  htmlFor={`terms-${agg.name}-${index}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.key}{option.doc_count ? ` (${option.doc_count})` : ''}
                </label>
              </div>
            )
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
