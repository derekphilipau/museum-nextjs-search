import * as React from "react"
import Link from "next/link"

const linkClasses = 'underline';

function appendQuery(url, name, val) {
  return `${url}${(url ? '&' : '')}${name}=${val}`
}

export function DescriptionRow({ name, displayName, value, item, isLink = false }) {

  const searchUrl = '/search?index=collections&'
  let qs = ''
  
  let val = value ? value : item[name];
  if (!name || !val || val.length === 0) return;
  let formattedValue = '';
  if (Array.isArray(val) && val.length > 0) {
    for (const v of val) {
      formattedValue += `${formattedValue.length > 0 ? ', ' : ''}${v}`;
      if (isLink) qs = appendQuery(qs, name, v);
    } 
  }
  else {
    formattedValue = val;
    if (isLink) qs = appendQuery(qs, name, val);
  }

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{displayName}</dt>
      <dd className="mt-1 flex text-sm sm:col-span-2 sm:mt-0">
        {qs?.length > 0 ? (
          <Link href={`${searchUrl}${qs}`} legacyBehavior>
            <a className={linkClasses}>
              {formattedValue}
            </a>
          </Link>
        ) : (
          <span>{val}</span>
        )
        }
      </dd>
    </div>
  )
}

