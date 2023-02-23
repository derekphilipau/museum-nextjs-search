import * as React from "react"
import { DescriptionRow } from "./description-row";

export function ObjectDescription({ item }) {
  if (!item?.id) return null;

  const maker = item.primaryConstituent || 'Unknown';

  return (
    <div className="mt-5 border-t border-gray-200">
      <dl className="divide-y divide-gray-200">
        <DescriptionRow name="primaryConstituent" value={maker} isLink={true} />
        <DescriptionRow name="medium" item={item} isLink={true} />
        {/*
        <DescriptionRow name="geographicalLocations" item={item} isLink={true} />
        */}
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
        <DescriptionRow name="museumLocation" item={item} isLink={true} />
        <DescriptionRow name="rightsType" item={item} />
      </dl>
      <pre>
        {item?.geographicalLocations}
      </pre>
    </div>
  )
}

/*
CAPTION Abbas Al-Musavi. Battle of Karbala, late 19th-early 20th century. Oil on canvas, 69 1/16 × 134 1/2 × 2 1/4 in. (175.4 × 341.6 × 5.7 cm). Brooklyn Museum, Gift of K. Thomas Elghanayan in honor of Nourollah Elghanayan, 2002.6 (Photo: Brooklyn Museum, 2002.6_PS2.jpg)
IMAGE overall, 2002.6_PS2.jpg. Brooklyn Museum photograph, 2010
*/