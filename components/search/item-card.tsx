import * as React from "react"
import Link from "next/link"

export function ItemCard({ item }) {

  const data = item._source;
  const imageSrc = `https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size2/${data.image}`;
  const maker = data.primaryConstituent || 'Unknown Maker';
  const href = `/collection/object/${data.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <div className="flex justify-center items-center bg-gray-50">
          <figure>
            <img className="object-contain h-48" src={imageSrc} alt="" />
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-3">
          <h4 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">{data.title}</h4>
          <a href="#">
            <h5 className="mb-1 text-lg text-gray-900 dark:text-white">{maker}</h5>
          </a>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-xs">
            {data.date}
          </p>
        </div>
      </div>
    </Link>
  )
}


