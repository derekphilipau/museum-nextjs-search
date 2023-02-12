import Link from "next/link"
import { getSmallOrRestrictedImageUrl } from '@/util/image.js';

export function ItemCard({ item }) {

  const imageSrc = getSmallOrRestrictedImageUrl(item);
  const maker = item.primaryConstituent || 'Maker Unknown';
  const href = `/collection/object/${item.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <div className="flex justify-center items-center bg-neutral-50 dark:bg-neutral-800">
          <figure>
            <img className="object-contain h-48" src={imageSrc} alt="" />
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-3">
          <h4 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
          <h5 className="mb-1 text-lg text-neutral-900 dark:text-white">{maker}</h5>
          <p className="font-normal text-neutral-700 dark:text-neutral-400 text-xs">
            {item.date}
          </p>
        </div>
      </div>
    </Link>
  )
}


