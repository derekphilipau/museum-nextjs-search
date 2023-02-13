import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface SearchPaginationProps {
  count: number,
  p: number,
  totalPages: number,
  onPageChangeHandler: any,
}

export function SearchPagination({ count, p, totalPages, onPageChangeHandler }: SearchPaginationProps) {
  return (
    <nav
      className="sm:flex items-center justify-between gap-x-4 pt-2"
      aria-label="Pagination"
      >
      <div className="text-sm">
        {count} results, page {p} of {totalPages} pages
      </div>
      <div className="flex items-center justify-end gap-x-4 pt-2">
        <Button
          disabled={p <= 1}
          onClick={() => onPageChangeHandler(p - 1)}
          variant="ghost"
          size="sm"
        >
          <Icons.chevronLeft className="h-5 w-5 mr-2" aria-hidden="true" />
          Previous
        </Button>
        <Button
          disabled={p >= totalPages}
          onClick={() => onPageChangeHandler(p + 1)}
          variant="ghost"
          size="sm"
        >
          Next
          <Icons.chevronRight className="h-5 w-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
