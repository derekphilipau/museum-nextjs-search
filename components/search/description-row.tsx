import * as React from "react"
import Link from "next/link"

function appendQuery(url, name, val) {
  return `${url}${(url ? '&' : '')}${name}=${val}`
}

export function DescriptionRow({ name, displayName, value, item, isLink }) {

  const searchUrl = '/search?index=collections&'
  let qs = ''
  
  if (!name) return;
  let val = value ? value : item[name]
  let formattedValue = ''
  if (Array.isArray(val) && val.length > 0) {
    for (const v of val) {
      formattedValue += `${formattedValue.length > 0 ? ', ' : ''}${v}`;
      qs = appendQuery(qs, name, v);
    } 
  }
  else {
    formattedValue = val;
    qs = appendQuery(qs, name, val);
  }

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{displayName}</dt>
      <dd className="mt-1 flex text-sm sm:col-span-2 sm:mt-0">
        {qs?.length > 0 ? (
          <Link href={`${searchUrl}${qs}`}>
            {formattedValue}
          </Link>
        ) : (
          <span>{val}</span>
        )
        }
      </dd>
    </div>
  )
}

