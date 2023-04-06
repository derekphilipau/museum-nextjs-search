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
  if (!(hslColor?.length > 0)) return 'white';
  const hsl = `hsl(${hslColor[0] * 360}, ${hslColor[1] * 100}%, ${
    hslColor[2] * 100
  }%)`;
  return hsl;
}

function getFontColor(hslColor) {
  if (!(hslColor?.length > 0)) return 'black';
  if (hslColor[2] * 100 > 50) return 'black';
  return 'white';
}

export function PaletteCard({ item, layout, showType }) {
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
          {item.dominantColorsHsl && (
            <div className="relative aspect-square items-center justify-center">
              {item.dominantColorsHsl.map(
                (color: any, i: Key) =>
                  color?.length > 0 && (
                    <div
                      className="h-1/6 w-full"
                      style={{
                        backgroundColor: getHsl(color),
                        color: getFontColor(color),
                      }}
                    ></div>
                  )
              )}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl">
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
              {item.date ? `${item.date},` : ''}
              {primaryConstituent ? ` ${primaryConstituent}` : ''}
            </h4>
          )}
          {layout === 'list' && (
            <>
              <h4 className="mb-2 text-xl font-semibold">
                {item.title}
                {item.date ? `, ${item.date}` : ''}
              </h4>
              <p>{trimStringToLengthAtWordBoundary(item.description, 200)}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
