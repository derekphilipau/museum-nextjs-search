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

  const primaryConstituent = item.primaryConstituent || 'Maker Unknown';
  const href = getObjectUrlWithSlug(item.id, item.title);

  return (
    <Link href={href}>
      <div className="py-4">
        {item.imageThumbnailUrl && (
          <div className="flex items-center justify-center">
            <figure>
              <Image
                src={item.imageThumbnailUrl}
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
            {primaryConstituent}
          </h5>
          <p className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
            {item.date}
          </p>
        </div>
      </div>
    </Link>
  );
}
