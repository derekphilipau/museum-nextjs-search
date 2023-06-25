import { Key } from 'react';

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
            <div
              key={index}
              style={{
                backgroundColor: `#${color.hex}`,
                height: `${height}px`,
                width: `${(color.percent * totalPercent) / 100}%`,
              }}
            ></div>
          )
      )}
    </div>
  );
}
