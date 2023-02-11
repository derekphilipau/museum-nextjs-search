import * as React from "react"
import Link from "next/link"

export function DescriptionRow({ name, value }) {
  if (!name || !value) return;
  let val = '';
  if (Array.isArray(value) && value.length > 0) {
    for (const v of value) {
      val += `${val.length > 0 ? ', ' : ''}${v}`
    } 
  }
  else val = value

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{name}</dt>
      <dd className="mt-1 flex text-sm sm:col-span-2 sm:mt-0">
        <span className="flex-grow">{val}</span>
      </dd>
    </div>
  )
}


