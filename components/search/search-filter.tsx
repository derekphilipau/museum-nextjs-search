import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
//import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import { Filter } from "@/types/filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SearchFilterProps {
  filter?: Filter,
  options?: any,
  checked?: boolean,
  onChangeHandler?: any,
}

export function SearchFilter({ filter, options, onChangeHandler }: SearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {filter.displayName}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 w-full">
        <div className="mb-2">
          <Input type="artist" placeholder={`Search ${filter.displayName}`} />
        </div>
        {options?.length > 0 && options?.map(
          (option, index) =>
            option && (
              <div className="flex items-center space-x-2">
                <Checkbox id={`terms-${filter.name}-${index}`} onClick={(e) => onChangeHandler(filter.name, option.key, e)} />
                <label
                  htmlFor={`terms-${filter.name}-${index}`}
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
