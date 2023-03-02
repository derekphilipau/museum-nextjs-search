import { Key } from 'react';
import Link from 'next/link';
import { trimStringToLengthAtWordBoundary } from '@/util/various';

export function ArchiveCard({ item }) {
  if (!item || !item.url) return null;

  const primaryConstituent = item.primaryConstituent;

  return (
    <Link href={item.url}>
      <div className="py-4">
        <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
          Archives
        </h4>
        <div className="">
          <h4 className="mb-2 text-xl font-semibold">
            {item.title}
            {item.date ? `, ${item.date}` : ''}
          </h4>
          <h5 className="text-lg">{primaryConstituent}</h5>
          {Array.isArray(item.description) &&
            item.description.map(
              (d: string, i: Key) =>
                d && (
                  <p
                    className="text-sm text-neutral-700 dark:text-neutral-400"
                    key={i}
                  >
                    {trimStringToLengthAtWordBoundary(d, 100)}
                  </p>
                )
            )}
        </div>
      </div>
    </Link>
  );
}
