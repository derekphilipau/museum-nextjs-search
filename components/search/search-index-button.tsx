"use client"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface SearchIndexButtonProps {
  index: string,
  params?: any,
  name: string,
  label: string
}

export function SearchIndexButton({ index, params, name, label }: SearchIndexButtonProps) {
  const router = useRouter();

  function buttonClick() {
    if (index !== name) {
      console.log('go to index: ' + name)
      let qs = name === 'collections' ? `hasPhoto=true` : '';
      qs += qs && params?.q ? '&' : ''
      qs += params?.q ? `q=${params?.q}` : '';
      router.push(`/search/${name}?${qs}`)
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
  )
}
