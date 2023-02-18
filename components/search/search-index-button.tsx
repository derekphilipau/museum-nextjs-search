"use client"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface SearchIndexButtonProps {
  params?: any,
  name: string,
  label: string
}

export function SearchIndexButton({ params, name, label }: SearchIndexButtonProps) {
  const router = useRouter();

  function buttonClick() {
    if (params?.index !== name) {
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
        variant={params?.index === name ? 'outline' : 'ghost'}
        className="text-lg"
        onClick={() => buttonClick()}
      >
        {label}
      </Button>
    </>
  )
}
