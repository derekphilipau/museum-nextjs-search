'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface SearchIndexButtonProps {
  index: string;
  params?: any;
  name: string;
  label: string;
}

export function SearchIndexButton({
  index,
  params,
  name,
  label,
}: SearchIndexButtonProps) {
  const router = useRouter();

  function buttonClick() {
    if (index !== name) {
      console.log('go to index: ' + name);
      const newParams = new URLSearchParams();
      if (name === 'collections') newParams.set('hasPhoto', 'true');
      if (params?.q) newParams.set('q', params.q);
      if (params?.layout) newParams.set('layout', params.layout);
      if (params?.f) newParams.set('f', params.f);
      router.push(`/search/${name}?${newParams}`);
    }
  }

  return (
    <>
      <Button
        variant={index === name ? 'outline' : 'ghost'}
        className="text-lg"
        onClick={() => buttonClick()}
        aria-label={`Search within ${label}`}
      >
        {label}
      </Button>
    </>
  );
}
