import Link from "next/link"
import { getSmallOrRestrictedImageUrl, NONE_IMG } from '@/util/image.js';
import Image from 'next/image'

export function ObjectCard({ item }) {

  const primaryConstituent = item.primaryConstituent || 'Maker Unknown';
  const href = `/collection/object/${item.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <div className="flex justify-center items-center bg-neutral-50 dark:bg-neutral-800">
          <figure>
            {
              item.image ? (
                <Image
                src={getSmallOrRestrictedImageUrl(item.image, item.copyrightRestricted)}
                className="h-48 object-contain"
                alt=""
                width={400}
                height={400}
              />
              ) : (
                <Image
                src={NONE_IMG}
                className="h-48 object-contain"
                alt=""
                width={400}
                height={400}
              />
              )
            }
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-3">
          <h4 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
          <h5 className="mb-1 text-lg text-neutral-900 dark:text-white">{primaryConstituent}</h5>
          <p className="font-normal text-neutral-700 dark:text-neutral-400 text-xs">
            {item.date}
          </p>
        </div>
      </div>
    </Link>
  )
}


