import Image from 'next/image';
import Link from 'next/link';
import { NONE_IMG, getSmallOrRestrictedImageUrl } from '@/util/image';

export function ObjectCard({ item }) {
  if (!item) return null;

  const primaryConstituent = item.primaryConstituent || 'Maker Unknown';

  const href = `/collection/object/${item.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
          Artwork
        </h4>
        <div className="flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
          <figure>
            {item.image ? (
              <Image
                src={getSmallOrRestrictedImageUrl(
                  item.image,
                  item.copyrightRestricted
                )}
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
            )}
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-3">
          <h4 className="mb-2 text-xl font-semibold">
            {item.title}
            {item.date ? `, ${item.date}` : ''}
          </h4>
          <h5 className="text-lg">{primaryConstituent}</h5>
          {item.primaryConstituentDates && (
            <span className="text-sm text-neutral-700 dark:text-neutral-400">
              {item.primaryConstituentDates}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
