import { Key } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';
import { NONE_IMG, getSmallOrRestrictedImageUrl } from '@/util/image';
import {
  getObjectUrlWithSlug,
  trimStringToLengthAtWordBoundary,
} from '@/util/various';

function getContainerClass(layout) {
  if (layout === 'grid') return 'py-4';
  return 'grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-3';
}

function getDetailsClass(layout) {
  if (layout === 'grid') return 'pt-3';
  return 'lg:col-span-2';
}

function getHsl(hslColor) {
  if (!hslColor) return 'white';
  const hsl = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
  return hsl;
}

export function SwatchCard({ item, layout, showType }) {
  if (!item) return null;
  const dict = getDictionary();

  const primaryConstituent = item.primaryConstituent || 'Maker Unknown';

  const href = getObjectUrlWithSlug(item.id, item.title);

  return (
    <Link href={href}>
      <div className={getContainerClass(layout)}>
        <div>
          {showType && layout === 'grid' && (
            <h4 className="text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.collections.itemTitle']}
            </h4>
          )}
          <div className="relative aspect-square items-center justify-center">
            <figure>
              {item.image ? (
                <Image
                  src={getSmallOrRestrictedImageUrl(
                    item.image,
                    item.copyrightRestricted
                  )}
                  className="h-72 w-full object-cover"
                  alt=""
                  width={400}
                  height={400}
                />
              ) : (
                <Image
                  src={NONE_IMG}
                  className="h-72 w-full object-contain"
                  alt=""
                  width={400}
                  height={400}
                />
              )}
              <figcaption></figcaption>
            </figure>
            {item.dominantColorsHsl && (
              <div className="flex items-center justify-center">
                {item.dominantColorsHsl.map(
                  (color: any, i: Key) =>
                    color && (
                      <div
                        className="aspect-square w-1/6"
                        style={{
                          backgroundColor: getHsl(color),
                        }}
                      ></div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
        <div className={getDetailsClass(layout)}>
          {showType && layout === 'list' && (
            <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.collections.itemTitle']}
            </h4>
          )}
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
          {layout === 'list' && (
            <p>{trimStringToLengthAtWordBoundary(item.description, 200)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
