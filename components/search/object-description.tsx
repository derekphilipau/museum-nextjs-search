import * as React from "react"
import Link from "next/link"
import { DescriptionRow } from "./description-row";

export function ObjectDescription({ item }) {

  if (!item?.id) return;

  const maker = item.primaryConstituent || 'Maker Unknown';

  return (
    <div className="mt-5 border-t border-gray-200">
      <dl className="divide-y divide-gray-200">
        <DescriptionRow name="Maker" value={maker} />
        <DescriptionRow name="Medium" value={item.medium} />
        <DescriptionRow name="Place Made" value={item.geographicalLocations} />
        <DescriptionRow name="Dates" value={item.date} />
        <DescriptionRow name="Dynasty" value={item.dynasty} />
        <DescriptionRow name="Period" value={item.period} />
        <DescriptionRow name="Dimensions" value={item.dimensions} />
        <DescriptionRow name="Signature" value={item.signed} />
        <DescriptionRow name="Inscriptions" value={item.inscribed} />
        <DescriptionRow name="Collections" value={item.collections} />
        <DescriptionRow name="Accession Number" value={item.accessionNumber} />
        <DescriptionRow name="Credit Line" value={item.creditLine} />
        <DescriptionRow name="Exhibitions" value={item.exhibitions} />
        <DescriptionRow name="Museum Location" value={item.museumLocation} />
        <DescriptionRow name="Rights Statement" value={item.rightsType} />
      </dl>
    </div>
  )
}

/*
CAPTION Abbas Al-Musavi. Battle of Karbala, late 19th-early 20th century. Oil on canvas, 69 1/16 × 134 1/2 × 2 1/4 in. (175.4 × 341.6 × 5.7 cm). Brooklyn Museum, Gift of K. Thomas Elghanayan in honor of Nourollah Elghanayan, 2002.6 (Photo: Brooklyn Museum, 2002.6_PS2.jpg)
IMAGE overall, 2002.6_PS2.jpg. Brooklyn Museum photograph, 2010
*/