import * as React from 'react';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { DescriptionRow } from './description-row';
import { GeographicalDescriptionRow } from './geographical-description-row';

interface CollectionObjectDescriptionProps {
  item: CollectionObjectDocument;
}

export function CollectionObjectDescription({ item }: CollectionObjectDescriptionProps) {
  if (!item?.id) return null;

  const primaryConstituentName = item.primaryConstituent?.name || 'Maker Unknown';

  return (
    <div className="mt-5 border-t border-gray-200">
      <dl className="divide-y divide-gray-200">
        <DescriptionRow name="primaryConstituent.name" value={primaryConstituentName} isLink={true} />
        <DescriptionRow name="medium" item={item} isLink={true} />
        <GeographicalDescriptionRow item={item} />
        <DescriptionRow name="date" item={item} />
        <DescriptionRow name="dynasty" item={item} isLink={true} />
        <DescriptionRow name="period" item={item} isLink={true} />
        <DescriptionRow name="dimensions" item={item} />
        <DescriptionRow name="signed" item={item} />
        <DescriptionRow name="inscribed" item={item} />
        <DescriptionRow name="collections" item={item} isLink={true} />
        <DescriptionRow name="accessionNumber" item={item} />
        <DescriptionRow name="creditLine" item={item} />
        <DescriptionRow name="exhibitions" item={item} isLink={true} />
        <DescriptionRow name="rightsType" item={item} />
        <DescriptionRow name="museumLocation.name" value={item.museumLocation?.name} isLink={true} />
      </dl>
    </div>
  );
}
