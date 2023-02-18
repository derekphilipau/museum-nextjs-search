"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { getBooleanValue } from "@/util/search";

interface SearchCheckboxProps {
  params?: any,
  name: string,
  value: boolean,
  label: string,
}

export function SearchCheckbox({ params, name, value, label }: SearchCheckboxProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [originalValue, setOriginalValue] = useState(getBooleanValue(value));

  function checkValue(checked) {
    const myValue = checked ? true : false;
    if (originalValue !== myValue) {
      console.log('checkbox go: ' + originalValue + ' new: ' + myValue)
      setOriginalValue(myValue);  // Make sure we remember the most recent value
      const updatedParams = new URLSearchParams(params);
      if (myValue) updatedParams.set(name, myValue + '');
      else updatedParams.delete(name);
      updatedParams.delete('p');
      router.push(`${pathname}?${updatedParams}`)
    }
  }

  useEffect(() => {
    setOriginalValue(value);
  }, [value]);

  return (
    <>
      <Checkbox
        id={name}
        onCheckedChange={(checked) => checkValue(checked)}
        checked={value}
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
