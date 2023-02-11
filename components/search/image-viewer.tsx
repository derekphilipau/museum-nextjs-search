import * as React from "react"
import dynamic from 'next/dynamic'
import Link from "next/link"
//import { OpenSeaDragonViewer } from "@/components/search/open-seadragon-viewer";
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

const IMG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/'
const IMG_LG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/'

export function ImageViewer({ item }) {

  if (!item?.id) return;

  const imageSrc = `${IMG_BASE_URL}${item.image}`;
  const href = `/collection/object/${item.id}`;

  return (
    <Dialog className="">
      <DialogTrigger>
        <figure>
          <img className="max-h-96" src={`${IMG_BASE_URL}${item?.image}`} alt="" />
          <figcaption></figcaption>
        </figure>
      </DialogTrigger>
      <DialogContent className="h-full min-w-full">
        <DialogHeader className="">
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            <div className="">
              {item?.image && (
                <OpenSeaDragonViewer image={`${IMG_LG_BASE_URL}${item.image}`} />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}


