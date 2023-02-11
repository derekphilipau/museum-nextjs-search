import * as React from "react"
import Link from "next/link"

export function SimilarItemCard({ item }) {

  const imageSrc = `https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size2/${item.image}`;
  const maker = item.primaryConstituent || 'Maker Unknown';
  const href = `/collection/object/${item.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <div className="flex justify-center items-center">
          <figure>
            <img className="object-contain h-48" src={imageSrc} alt="" />
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-2">
          <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
          <h5 className="text-sm text-gray-900 dark:text-white">{maker}</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-xs">
            {item.date}
          </p>
        </div>
      </div>
    </Link>
  )
}


