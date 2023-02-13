import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchPaginationProps {
  count: number,
  p: number,
  size: string,
  totalPages: number,
  onPageChangeHandler: any,
  onSizeChangeHandler: any,
}

export function SearchPagination({ count, p, size, totalPages, onPageChangeHandler, onSizeChangeHandler }: SearchPaginationProps) {

  return (
    <nav
      className="items-center justify-between gap-x-4 pt-2 sm:flex"
      aria-label="Pagination"
      >
      <div className="flex items-center justify-start gap-x-4 pt-2">
        <div className="flex w-16">
          <Select defaultValue={size} onValueChange={(value) => onSizeChangeHandler(value)}>
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
        <div className="text-xs">
          {count} results, page {p} of {totalPages}.
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-4 pt-2">
        <Button
          disabled={p <= 1}
          onClick={() => onPageChangeHandler(p - 1)}
          variant="ghost"
          size="sm"
        >
          <Icons.chevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
          Previous
        </Button>
        <Button
          disabled={p >= totalPages}
          onClick={() => onPageChangeHandler(p + 1)}
          variant="ghost"
          size="sm"
        >
          Next
          <Icons.chevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
