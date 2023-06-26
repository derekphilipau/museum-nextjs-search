import { Key } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function DominantColors({ item, height = 10 }) {
  if (!item?.image?.dominantColors?.length) return null;

  // get total percent of all colors
  const totalPercent = item.image.dominantColors.reduce(
    (acc, color) => acc + color.percent,
    0
  );

  return (
    <div className="flex w-full items-center">
      {item.image.dominantColors.map(
        (color, index: Key) =>
          color?.hex && (
            <Link
              className="rounded-none"
              key={index}
              href={`/search/collections?hasPhoto=true&color=${color.hex}`}
              style={{
                backgroundColor: `#${color.hex}`,
                height: `${height}px`,
                width: `${(color.percent * totalPercent) / 100}%`,
              }}
            ></Link>
          )
      )}
    </div>
  );
}
