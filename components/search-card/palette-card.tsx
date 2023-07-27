import { Key } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';
import {
  getObjectUrlWithSlug,
  trimStringToLengthAtWordBoundary,
} from '@/util/various';

function getContainerClass(layout) {
  if (layout === 'grid') return '';
  return 'grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-3';
}

function getDetailsClass(layout) {
  if (layout === 'grid') return '';
  return 'lg:col-span-2';
}

function getHsl(hslColor) {
  if (!hslColor) return 'white';
  const hsl = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
  return hsl;
}

function getFontColor(hslColor) {
  if (!hslColor) return 'black';
  if (hslColor.l > 50) return 'black';
  return 'white';
}

export function PaletteCard({ item, layout, showType }) {
  if (!item) return null;
  const dict = getDictionary();

  const primaryConstituentName =
    item.primaryConstituent?.name || 'Maker Unknown';

  const href = getObjectUrlWithSlug(item._id, item.title);

  return (
    <Link href={href}>
      <div className={getContainerClass(layout)}>
        <div>
          {showType && layout === 'grid' && (
            <h4 className="text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.collections.itemTitle']}
            </h4>
          )}
          {item.image?.dominantColors && (
            <div className="relative aspect-square items-center justify-center">
              {item.image?.dominantColors.map(
                (color: any, i: Key) =>
                  color && (
                    <div
                      className="h-1/6 w-full"
                      style={{
                        backgroundColor: getHsl(color),
                        color: getFontColor(color),
                      }}
                    ></div>
                  )
              )}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl">
                {trimStringToLengthAtWordBoundary(item.title, 100)}
              </div>
            </div>
          )}
        </div>
        <div className={getDetailsClass(layout)}>
          {showType && layout === 'list' && (
            <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.collections.itemTitle']}
            </h4>
          )}

          {layout !== 'list' && (
            <h4 className="text-sm">
              {item.formattedDate ? `${item.formattedDate},` : ''}
              {primaryConstituentName}
            </h4>
          )}
          {layout === 'list' && (
            <>
              <h4 className="mb-2 text-xl font-semibold">
                {item.title}
                {item.formattedDate ? `, ${item.formattedDate}` : ''}
              </h4>
              <p>{trimStringToLengthAtWordBoundary(item.description, 200)}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
