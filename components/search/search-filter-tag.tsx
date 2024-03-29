'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';

import { Button } from '@/components/ui/button';
import { Icons } from '../icons';

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
    const updatedParams = new URLSearchParams(params);
    updatedParams.delete(name);
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
  }

  return (
    <Button
      onClick={() => buttonClick()}
      aria-label={dict['button.removeFilter']}
      variant="outline"
      size="sm"
    >
      {name === 'color' ? (
        <Icons.circle
          className={`h-6 w-6 rounded-full`}
          style={{ backgroundColor: `#${value}`, color: `#${value}` }}
        />
      ) : (
        <div>{value}</div>
      )}
      <Icons.x className="ml-2 h-4 w-4" />
    </Button>
  );
}
