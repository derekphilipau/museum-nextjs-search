import Link from "next/link"
import { getSmallOrRestrictedImageUrl, NONE_IMG } from '@/util/image.js';
import Image from 'next/image'

export function ItemCard({ item }) {

  return (
    <Link href={item.url}>
      <div className="py-4">
        <div className="flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
          <figure>
            {
              item.image ? (
                <Image
                src={item.image}
                className="h-48 object-contain"
                alt=""
                width={400}
                height={400}
              />
              ) : (
                <Image
                src={NONE_IMG}
                className="h-48 object-contain"
                alt=""
                width={400}
                height={400}
              />
              )
            }
            <figcaption></figcaption>
          </figure>
        </div>
        <div className="pt-3">
          <h4 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
          {
            item.date && (
              <p className="font-normal text-neutral-700 dark:text-neutral-400 text-xs">
                {item.date}
              </p>  
            )
          }
        </div>
      </div>
    </Link>
  )
}


