import * as React from "react"
import Link from "next/link"
import { DescriptionRow } from "./description-row";

export function ObjectDescription({ item }) {

  if (!item?.id) return;

  const maker = item.primaryConstituent || 'Unknown';

  return (
    <div className="mt-5 border-t border-gray-200">
      <dl className="divide-y divide-gray-200">
        <DescriptionRow name="primaryConstituent" displayName="Maker" value={maker} isLink={true} />
        <DescriptionRow name="medium" displayName="Medium" item={item} isLink={true} />
        <DescriptionRow name="geographicalLocations" displayName="Place Made" item={item} isLink={true} />
        <DescriptionRow name="date" displayName="Dates" item={item} />
        <DescriptionRow name="dynasty" displayName="Dynasty" item={item} isLink={true} />
        <DescriptionRow name="period" displayName="Period" item={item} isLink={true} />
        <DescriptionRow name="dimensions" displayName="Dimensions" item={item} />
        <DescriptionRow name="signed" displayName="Signature" item={item} />
        <DescriptionRow name="inscribed" displayName="Inscriptions" item={item} />
        <DescriptionRow name="collections" displayName="Collections" item={item} isLink={true} />
        <DescriptionRow name="accessionNumber" displayName="Accession Number" item={item} />
        <DescriptionRow name="creditLine" displayName="Credit Line" item={item} />
        <DescriptionRow name="exhibitions" displayName="Exhibitions" item={item} isLink={true} />
        <DescriptionRow name="museumLocation" displayName="Museum Location" item={item} isLink={true} />
        <DescriptionRow name="rightsType" displayName="Rights Statement" item={item} />
      </dl>
    </div>
  )
}

/*
CAPTION Abbas Al-Musavi. Battle of Karbala, late 19th-early 20th century. Oil on canvas, 69 1/16 × 134 1/2 × 2 1/4 in. (175.4 × 341.6 × 5.7 cm). Brooklyn Museum, Gift of K. Thomas Elghanayan in honor of Nourollah Elghanayan, 2002.6 (Photo: Brooklyn Museum, 2002.6_PS2.jpg)
IMAGE overall, 2002.6_PS2.jpg. Brooklyn Museum photograph, 2010
*/