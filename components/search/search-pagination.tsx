import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface SearchPaginationProps {
  count: number,
  pageIndex: number,
  totalPages: number,
  onPageChangeHandler: any,
}

export function SearchPagination({ count, pageIndex, totalPages, onPageChangeHandler }: SearchPaginationProps) {
  return (
    <div className="sm:flex items-center justify-between gap-x-4 pt-2">
      <div className="text-sm">
        {count} results, page {pageIndex} of {totalPages} pages
      </div>
      <div className="flex items-center justify-end gap-x-4 pt-2">
        <Button
          disabled={pageIndex <= 1}
          onClick={() => onPageChangeHandler(pageIndex - 1)}
          variant="ghost"
          size="sm"
        >
          <Icons.chevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>
        <Button
          disabled={pageIndex >= totalPages}
          onClick={() => onPageChangeHandler(pageIndex + 1)}
          variant="ghost"
          size="sm"
        >
          Next
          <Icons.chevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
