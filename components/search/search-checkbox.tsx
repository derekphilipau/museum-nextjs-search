"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { getBooleanValue } from "@/util/search";

interface SearchCheckboxProps {
  params?: any,
  name: string,
  label: string
}

export function SearchCheckbox({ params, name, label }: SearchCheckboxProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [originalValue, setOriginalValue] = useState(getBooleanValue(params?.[name]));
  const [myValue, setMyValue] = useState(getBooleanValue(params?.[name]));

  useEffect(() => {
    if (originalValue !== myValue) {
      console.log('checkbox go: ' + originalValue + ' new: ' + myValue)
      setOriginalValue(myValue);  // Make sure we remember the most recent value
      const updatedParams = new URLSearchParams(params);
      if (myValue) updatedParams.set(name, myValue + '');
      else updatedParams.delete(name);
      updatedParams.delete('p');
      updatedParams.delete('index')
      router.push(`${pathname}?${updatedParams}`)
    }
  }, [myValue, originalValue,router, params, name, pathname]);

  return (
    <>
      <Checkbox
        id={name}
        onCheckedChange={(checked) => setMyValue(checked ? true : false)}
        checked={myValue}
      />
      <label
        htmlFor={name}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </>
  )
}
