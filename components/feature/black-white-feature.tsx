import { Key } from 'react';

import { FeatureObjectCard } from '@/components/feature/feature-object-card';
import { CollectionObjectCard } from '../collection-object/collection-object-card';
import { Icons } from '@/components/icons';

export function BlackWhiteFeature({ tour }: { tour: any }) {
  return (
    <>
    <section className="container pt-6 pb-8">
        <h3 className="mb-2 text-xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-2xl lg:text-3xl">
          American Art
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          <a href="/tour/give-flowers" className="">To Give Flowers</a>
          <a href="#" className="text-indigo-600">The Black & White Show</a>
          <a href="#" className="">Surface Tension</a>
          <a href="#" className="">Several Seats</a>
          <a href="#" className="">A Quiet Place</a>
          <a href="#" className="">Can I Get a Witness</a>
          <a href="#" className="">Trouble the Water</a>
          <a href="#" className="">Fantasies & Futures</a>
        </div>
        
      </section>
      <section className="container pt-6 pb-3">
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          The Black & White Show
        </h1>
        <h1 className="mt-6 text-xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-3xl lg:text-3xl">
          Gallery Installation
        </h1>
      </section>
      <section className="relative h-[600px] w-screen min-w-max overflow-x-scroll"
      style={{boxShadow: '0 0 20px 0 rgb(0 0 0 / 0.1)'}}>
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
      <section className="container pt-6 pb-8">
        <h1 className="mt-2 text-xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-3xl lg:text-3xl">
          Artworks
        </h1>
        <div className="relative my-4 grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:pb-10 lg:grid-cols-3">
          {tour.tourObjects?.length > 0 &&
            tour.tourObjects.map(
              (item: any, i: Key) =>
                item && (
                  <div className="" key={i}>
                    {item.type === 'object' && (
                      <CollectionObjectCard item={item} layout="grid" showType={false} />
                    )}
                  </div>
                )
            )}
        </div>
      </section>
    </>
  );
}
