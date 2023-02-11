import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
//import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import { Agg } from "@/types/agg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SearchAggProps {
  index?: string,
  agg?: Agg,
  options?: any,
  filters?: any,
  checked?: boolean,
  onChangeHandler?: any,
}

export function SearchAgg({ index, agg, options, filters, onChangeHandler }: SearchAggProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [realQuery, setRealQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState(options);

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
      if (options?.length > 0 && dynamicOptions?.length === 0)
        setDynamicOptions(options);
      return;
    }
    else {
      fetch(`/api/options?index=${index}&field=${agg.name}&q=${realQuery}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('got options', data)
          if (data?.length > 0) setDynamicOptions(data)
          else setDynamicOptions(options)
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
        {dynamicOptions?.length > 0 && dynamicOptions?.map(
          (option, index) =>
            option && (
              <div className="flex items-center space-x-2" key={`agg-${agg.name}-${index}`}>
                <Checkbox 
                  id={`terms-${agg.name}-${index}`} 
                  onCheckedChange={(checked) => onChangeHandler(agg.name, option.key, checked)} 
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
