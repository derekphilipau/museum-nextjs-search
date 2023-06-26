'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';

interface SearchFilterTagProps {
  params?: any;
  name: string;
  value: any;
}

export function SearchColorFilterTag({
  params,
  name,
  value,
}: SearchFilterTagProps) {
  const router = useRouter();
  const pathname = usePathname();

  const dict = getDictionary();

  function buttonClick() {
    const updatedParams = new URLSearchParams(params);
    updatedParams.delete(name);
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
  }

  return (
    <button
      type="button"
      className="flex items-center gap-x-2 rounded-full bg-neutral-100 py-1.5 px-3 font-medium text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
      onClick={() => buttonClick()}
      aria-label={dict['button.removeFilter']}
    >
      <div>{value}</div>
      <div>
        <svg
          className="h-3 w-3"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="2" d="M1 1l6 6m0-6L1 7" />
        </svg>
        <span className="sr-only">Remove filter option</span>
      </div>
    </button>
  );
}
