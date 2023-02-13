import * as React from "react"
import Link from "next/link"

const linkClasses = 'underline';

interface DescriptionRowProps {
  name: string,
  displayName: string,
  value?: any,
  item?: any,
  isLink?: boolean
}

export function DescriptionRow({ name, displayName, value, item, isLink = false }: DescriptionRowProps) {

  const searchUrl = '/search?index=collections'
  let qs = ''

  let val = value ? value : item[name];
  if (!name || !val || val.length === 0) return;
  if (!Array.isArray(val)) val = [val];

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{displayName}</dt>
      <dd className="mt-1 flex text-sm sm:col-span-2 sm:mt-0">
        {isLink && val.map(
          (tag, index) =>
            tag && (
              <>
                {index > 0 ? ',  ' : ''}
                <Link
                  key={index}
                  href={`${searchUrl}&${name}=${tag}`}
                  className={linkClasses}
                >
                  {tag}
                </Link>
              </>
            )
        )}
        {!isLink && val.map(
          (tag, index) =>
            tag && (
              <>
                {index > 0 ? ',  ' : ''} {tag}
              </>
            )
        )}
      </dd>
    </div>
  )
}

