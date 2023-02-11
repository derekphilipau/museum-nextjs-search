import { useEffect } from "react";
import dynamic from 'next/dynamic'
import Link from "next/link"
import { isImageRestricted, getSmallImageUrl, getRestrictedImageUrl, getLargeImageUrl } from '@/util/image.js';

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

  //const isRestricted = isImageRestricted(item.image);
  //const smallImageUrl = isRestricted ? getRestrictedImageUrl(item.image) : getSmallImageUrl(item.image);
  let isLoaded = false;
  let isRestricted = false; // TODO
  const smallImageUrl = getSmallImageUrl(item.image);
  const largeImageUrl = getLargeImageUrl(item.image);
  const href = `/collection/object/${item.id}`;

  /*
  useEffect(() => {
    async function checkImageRestriction() {
      if (item.image) isRestricted = await isImageRestricted(item.image);
      console.log('is restricted: ' + isRestricted)
    }
    if(!isLoaded) {
      checkImageRestriction();
      isLoaded = true;
    } 
  }, []);
  */

  return (
    <>
      {isRestricted ? (
        <figure>
          <img className="max-h-96" src={smallImageUrl} alt="" />
          <figcaption></figcaption>
        </figure>
      ) : (
        <Dialog className="">
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
    </>
  )
}


