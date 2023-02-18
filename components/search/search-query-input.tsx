"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"

interface SearchQueryInputProps {
  pathname: string,
  params?: any
}

export function SearchQueryInput({pathname, params}: SearchQueryInputProps) {
  const router = useRouter();
  const [originalQuery, setOriginalQuery] = useState(params.q || '');
  const [myQuery, setMyQuery] = useState(params.q || '');

  useEffect(() => {
    const debounceQuery = setTimeout(() => {
      const updatedParams = new URLSearchParams(params);    
      if (myQuery !== originalQuery) {
        setOriginalQuery(myQuery); // Make sure we remember the most recent query.
        if (myQuery) updatedParams.set('q', myQuery);
        else updatedParams.delete('q');
        updatedParams.delete('p');
        updatedParams.delete('index');
        router.push(`${pathname}?${updatedParams}`);
      }
    }, 1000);
    return () => clearTimeout(debounceQuery);
  }, [myQuery, originalQuery, router, params, pathname]);

  return (
    <Input name="query" placeholder="Search" value={myQuery} onChange={(e) => setMyQuery(e.target.value)} />
  )
}
