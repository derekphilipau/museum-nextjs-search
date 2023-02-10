import * as React from "react"
import Link from "next/link"

import { ChevronsUpDown, Plus, X } from "lucide-react"

import { Filter } from "@/types/filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ItemCard({ item }) {

  const data = item._source;
  const imageSrc = `https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size2/${data.image}`;
  const maker = data.primaryConstituent || 'Unknown Maker';
  const href = `/collection/object/${data.id}`;

  return (
    <Link href={href}>
      <div className="py-4">
        <img className="w-full object-cover" src={imageSrc} alt="" />
        <div className="pt-2">
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


