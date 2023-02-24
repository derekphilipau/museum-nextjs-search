import * as React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';

interface DescriptionRowProps {
  item?: any;
  isLink?: boolean;
}

export function GeographicalDescriptionRow({ item }: DescriptionRowProps) {
  const dict = getDictionary();
  const displayName =
    dict?.[`object.field.geographicalLocations`] || 'Unknown field';
  const searchUrl = '/search/collections?';

  let val = item.geographicalLocations;
  if (!val || val.length === 0) return null;

  // [{"id":5027,"name":"China","type":"Place manufactured"}]

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {displayName}
      </dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
        {val.map(
          (tag, index) =>
            tag && (
              <>
                {tag.type}:{' '}
                <Link
                  key={index}
                  href={`${searchUrl}primaryGeographicalLocation=${tag.name}`}
                  className="underline"
                >
                  {`${tag.name}${index !== val.length - 1 ? ',  ' : ''}`}
                </Link>
              </>
            )
        )}
      </dd>
    </div>
  );
}
