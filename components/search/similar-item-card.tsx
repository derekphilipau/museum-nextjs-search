import * as React from "react"
import Link from "next/link"
import { isImageRestricted, getSmallOrRestrictedImageUrl } from '@/util/image.js';

export function SimilarItemCard({ item }) {

  let imageSrc = getSmallOrRestrictedImageUrl(item);
  const primaryConstituent = item.primaryConstituent || 'Maker Unknown';
  const href = `/collection/object/${item.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <div className="flex justify-center items-center">
          <figure>
            <img className="object-contain h-48" src={imageSrc} alt="" />
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-2">
          <h4 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
          <h5 className="text-sm text-neutral-900 dark:text-white">{primaryConstituent}</h5>
          <p className="font-normal text-neutral-700 dark:text-neutral-400 text-xs">
            {item.date}
          </p>
        </div>
      </div>
    </Link>
  )
}


