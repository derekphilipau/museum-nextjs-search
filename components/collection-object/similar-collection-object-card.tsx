import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getObjectUrlWithSlug } from '@/util/various';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';

export function SimilarCollectionObjectCard({
  item,
}: {
  item: CollectionObjectDocument;
}) {
  if (!item) return null;

  const primaryConstituentName = item.primaryConstituent?.name || 'Maker Unknown';
  const href = getObjectUrlWithSlug(item.id, item.title);

  return (
    <Link href={href}>
      <div className="py-4">
        {item.image?.thumbnailUrl && (
          <div className="flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <figure>
              <Image
                src={item.image?.thumbnailUrl}
                className="h-48 object-contain"
                alt=""
                width={400}
                height={400}
              />
              <figcaption></figcaption>
            </figure>
          </div>
        )}
        <div className="pt-2">
          <h4 className="font-semibold text-neutral-900 dark:text-white">
            {item.title}
          </h4>
          <h5 className="text-sm text-neutral-900 dark:text-white">
            {primaryConstituentName}
          </h5>
          <p className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
            {item.formattedDate}
          </p>
        </div>
      </div>
    </Link>
  );
}
