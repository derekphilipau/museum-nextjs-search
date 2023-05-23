import { Key } from 'react';

import { FeatureObjectCard } from '@/components/feature/feature-object-card';
import { ObjectCard } from '../search/object-card';

export function GiveFlowersFeature({ tour }: { tour: any }) {
  return (
    <>
      <section className="container pt-6 pb-8">
        <h3 className="text-xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-3xl lg:text-4xl">
          from our Mother's gardens
        </h3>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          "To Give Flowers"
        </h1>
      </section>
      <section className="relative h-[600px] w-screen min-w-max overflow-x-scroll bg-[url('/img/tour/bg2.jpg')] ">
        {tour.tourObjects?.length > 0 &&
          tour.tourObjects.map(
            (tourObject: any, i: Key) =>
              tourObject?.id && (
                <FeatureObjectCard key={i} tourObject={tourObject} />
              )
          )}
      </section>
      <section className="container pt-6 pb-8">
        <h1 className="mt-2 text-xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-3xl lg:text-4xl">
          Artworks
        </h1>
        <div className="relative my-4 grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:pb-10 lg:grid-cols-3">
          {tour.tourObjects?.length > 0 &&
            tour.tourObjects.map(
              (item: any, i: Key) =>
                item && (
                  <div className="" key={i}>
                    {item.type === 'object' && (
                      <ObjectCard item={item} layout="grid" showType={false} />
                    )}
                  </div>
                )
            )}
        </div>
      </section>
    </>
  );
}
