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
  agg?: Agg,
  options?: any,
  filters?: any,
  checked?: boolean,
  onChangeHandler?: any,
}

export function SearchAgg({ agg, options, filters, onChangeHandler }: SearchAggProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false)

  let checked = []
  if (agg.name in filters) {
    checked.push(filters[agg.name])
  }
  console.log('filters', filters)
  console.log('checked', checked)

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
          <Input type="artist" placeholder={`Search ${agg.displayName}`} />
        </div>
        {options?.length > 0 && options?.map(
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
                  {option.key} ({option.doc_count})
                </label>
              </div>
            )
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
