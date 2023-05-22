import { Key } from 'react';

import { FeatureObjectCard } from '@/components/feature/feature-object-card';
import { ObjectCard } from '../search/object-card';

export function BlackWhiteFeatureFull({ tour }: { tour: any }) {
  return (
    <section className="relative h-screen w-screen min-w-max overflow-x-scroll">
      <div className="absolute h-full w-[1630px] bg-white"></div>
      <div className="absolute h-full w-[760px] bg-black"></div>
      {tour.tourObjects?.length > 0 &&
        tour.tourObjects.map(
          (tourObject: any, i: Key) =>
            tourObject?.id && (
              <FeatureObjectCard key={i} tourObject={tourObject} />
            )
        )}
    </section>
  );
}
