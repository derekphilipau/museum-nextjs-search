import { Key } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';

interface DescriptionRowProps {
  name: string;
  value?: string;
  item?: CollectionObjectDocument;
  isLink?: boolean;
}

export function DescriptionRow({
  name,
  value,
  item,
  isLink = false,
}: DescriptionRowProps) {
  const dict = getDictionary();
  const displayName = dict?.[`object.field.${name}`] || 'Unknown field';
  const searchUrl = '/search/collections?';

  let val = value ? value : item?.[name];
  if (!name || !val || val.length === 0) return null;
  if (!Array.isArray(val)) val = [val];

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {displayName}
      </dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
        {isLink &&
          val.map(
            (tag, index) =>
              tag && (
                <Link
                  key={index}
                  href={`${searchUrl}${name}=${tag}`}
                  className="underline"
                >
                  {`${tag}${index !== val.length - 1 ? ',  ' : ''}`}
                </Link>
              )
          )}
        {!isLink &&
          val.map(
            (tag: string, i: Key) =>
              tag && (
                <span key={i}>{`${i > 0 ? ',  ' : ''}${tag}`}</span>
              )
          )}
      </dd>
    </div>
  );
}
