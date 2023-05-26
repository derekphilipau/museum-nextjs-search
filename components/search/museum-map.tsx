import * as React from 'react';
import Image from 'next/image';
import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { DescriptionRow } from './description-row';
import { GeographicalDescriptionRow } from './geographical-description-row';

interface MuseumMapProps {
  item: CollectionObjectDocument;
}

export function MuseumMap({ item }: MuseumMapProps) {
  if (!item?.id) return null;

  const location = item.museumLocation || '';

  return (
    <div className="mt-5 border-t border-gray-200">
      <Image
        src={'/img/floorplan.svg'}
        className="object-contain"
        alt=""
        width={400}
        height={400}
      />
    </div>
  );
}
