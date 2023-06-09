'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';

interface SearchFilterTagProps {
  params?: any;
  name: string;
  value: any;
}

export function SearchFilterTag({ params, name, value }: SearchFilterTagProps) {
  const router = useRouter();
  const pathname = usePathname();

  const dict = getDictionary();

  function buttonClick() {
    console.log('remove filter: ' + name + ' value: ' + value);
    const updatedParams = new URLSearchParams(params);
    updatedParams.delete(name);
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
  }

  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 py-1 pl-2.5 pr-1 text-sm font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
      {value}
      <button
        type="button"
        className="ml-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 focus:bg-neutral-500 focus:text-white focus:outline-none"
        onClick={() => buttonClick()}
        aria-label={dict['button.removeFilter']}
      >
        <span className="sr-only">Remove filter option</span>
        <svg
          className="h-2 w-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
}
