import { useEffect } from "react";
import dynamic from 'next/dynamic'
import Link from "next/link"
import {
  isImageRestricted,
  getRestrictedImageUrl,
  getSmallOrRestrictedImageUrl,
  getLargeImageUrl
} from '@/util/image.js';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const OpenSeaDragonViewer = dynamic(() => import('./open-seadragon-viewer'), {
  ssr: false
})

export function ImageViewer({ item }) {

  if (!item?.id) return;

  const smallImageUrl = getSmallOrRestrictedImageUrl(item);
  const largeImageUrl = getLargeImageUrl(item.image);

  return (
    <div className="flex flex-col items-center">
      <div>
        {isImageRestricted(item) ? (
          <figure>
            <img className="max-h-96" src={smallImageUrl} alt="" />
            <figcaption></figcaption>
          </figure>
        ) : (
          <Dialog>
            <DialogTrigger>
              <figure>
                <img className="max-h-96" src={smallImageUrl} alt="" />
                <figcaption></figcaption>
              </figure>
            </DialogTrigger>
            <DialogContent className="h-full min-w-full">
              <DialogHeader className="">
                <DialogTitle className="z-50">
                  <span className="px-4 py-3 rounded-lg bg-white dark:bg-neutral-900 bg-opacity-50">
                    {item.title}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  <div>
                    {item?.image && (
                      <OpenSeaDragonViewer image={largeImageUrl} />
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {item?.image?.length > 1 && (
        <div className="flex flex-wrap justify-start gap-2 my-6">
          {item?.images?.map(
            (image, index) =>
              image?.filename && (
                <div className="w-16 flex justify-center items-center bg-neutral-50 dark:bg-neutral-800">
                  <figure key={index}>
                    <img className="object-contain" src={getRestrictedImageUrl(image.filename)} alt="" />
                    <figcaption></figcaption>
                  </figure>
                </div>
              )
          )}
        </div>
      )}
    </div>
  )
}


