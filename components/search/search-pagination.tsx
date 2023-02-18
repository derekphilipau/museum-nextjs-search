"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchPaginationProps {
  params: any,
  index: string,
  count: number,
  p: number,
  size: string,
  totalPages: number,
  isShowFilters: boolean
}

export function SearchPagination({ params, index, count, p, size, totalPages, isShowFilters }: SearchPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [originalPage, setOriginalPage] = useState(params?.p || 1);
  const [myPage, setMyPage] = useState(params?.p || 1);

  const [originalSize, setOriginalSize] = useState(params?.size || '24');
  const [mySize, setMySize] = useState(params?.size || '24');

  useEffect(() => {
    if (originalPage !== myPage) {
      console.log('pagination go: ' + originalPage + ' new: ' + myPage)
      setOriginalPage(myPage); // Make sure we remember the most recent value
      const updatedParams = new URLSearchParams(params);
      if (myPage > 1) updatedParams.set('p', myPage + '');
      else updatedParams.delete('p');
      updatedParams.delete('index')
      router.push(`${pathname}?${updatedParams}`)
    }
  }, [myPage, originalPage, router, params, pathname]);

  useEffect(() => {
    if (originalSize !== mySize) {
      console.log('size go: ' + originalSize + ' new: ' + mySize)
      setOriginalSize(mySize); // Make sure we remember the most recent value
      const updatedParams = new URLSearchParams(params);
      if (mySize && mySize != '24') updatedParams.set('size', mySize);
      else updatedParams.delete('size');
      updatedParams.delete('index')
      router.push(`${pathname}?${updatedParams}`)
    }
  }, [mySize, originalSize, router, params, pathname]);

  return (
    <nav
      className="items-center justify-between gap-x-4 sm:flex"
      aria-label="Pagination"
      >
      <div className="flex items-center justify-start gap-x-4">
          {/*
        {!isShowFilters && index === 'collections' && (
        <div className="hidden sm:block">
          <Button
            onClick={() => onShowFilters(true)}
            variant="ghost"
            size="sm"
          >
            <Icons.slidersHorizontal className="mr-4 h-5 w-5" />
            Show Filters
          </Button>
        </div>
        )}
        */}
        <div className="flex w-16">
          <Select value={size} onValueChange={(value) => setMySize(value)}>
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
      <div className="flex items-center justify-end gap-x-4">
        <Button
          disabled={p <= 1}
          onClick={() => setMyPage(p - 1)}
          variant="ghost"
          size="sm"
        >
          <Icons.chevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
          Previous
        </Button>
        <Button
          disabled={p >= totalPages}
          onClick={() => setMyPage(p + 1)}
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
