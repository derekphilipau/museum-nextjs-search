'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {
  getLargeImageUrl,
  getRestrictedImageUrl,
  getSmallOrRestrictedImageUrl,
} from '@/util/image';
import { getCaption } from '@/util/various';
import useEmblaCarousel from 'embla-carousel-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const OpenSeaDragonViewer = dynamic(() => import('./open-seadragon-viewer'), {
  ssr: false,
});

export function ImageViewer({ item }) {
  const [sortedImages, setSortedImages] = useState(getSortedImages(item));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<any>({});
  const [isCopyrightRestricted, setIsCopyrightRestricted] = useState(false);
  const [open, setOpen] = useState(false);
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });

  /**
   * Sometimes the item's main image (item.image) is ranked at the same level
   * as other item images.  Force the main image to have the highest rank (0).
   */
  function getSortedImages(item) {
    if (item?.images?.length) {
      if (item.image) {
        const index = item.images.findIndex((o) => o.filename === item.image);
        if (index !== -1 && item.images[index]?.rank) {
          item.images[index].rank = 0;
        }
      }
      return item?.images?.sort((a, b) => a.rank - b.rank) || [];
    }
  }

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedImageIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    onSelect();
  }, [embla, onSelect]);

  useEffect(() => {
    setSortedImages(getSortedImages(item));
    setSelectedImageIndex(0);
    setIsCopyrightRestricted(item.copyrightRestricted);
  }, [item]);

  useEffect(() => {
    setSelectedImage(sortedImages?.[selectedImageIndex]);
  }, [selectedImageIndex, sortedImages]);

  if (!item?.id || !(item?.images?.length > 0)) return null;

  function getThumbnailClass(filename) {
    const base = 'flex w-16 items-center justify-center p-1 cursor-pointer';
    if (filename === selectedImage?.filename)
      return `${base} border border-neutral-400`;
    return base;
  }

  function clickImage(index) {
    setSelectedImageIndex(index);
    if (!isCopyrightRestricted) setOpen(true);
  }

  function clickThumbnail(index) {
    setSelectedImageIndex(index);
    if (!embla) return;
    embla.scrollTo(index);
  }

  return (
    <div className="flex flex-col items-center">
      {sortedImages?.length > 0 && (
        <div className="">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {sortedImages.map(
                (image, index) =>
                  image.filename && (
                    <div
                      key={index}
                      className="embla__slide min-w-0"
                      style={{ flex: '0 0 100%' }}
                      onClick={() => clickImage(index)}
                    >
                      <figure key={index}>
                        <Image
                          src={getSmallOrRestrictedImageUrl(
                            image?.filename,
                            isCopyrightRestricted
                          )}
                          className={
                            isCopyrightRestricted
                              ? 'max-h-96 object-contain'
                              : 'max-h-96 cursor-pointer object-contain'
                          }
                          alt=""
                          width={800}
                          height={800}
                        />
                        <figcaption className="mt-4 whitespace-normal break-all text-xs text-neutral-500 dark:text-neutral-400">
                          {getCaption(item, image?.filename)}
                        </figcaption>
                      </figure>
                      {isCopyrightRestricted && (
                        <p className="mt-4 whitespace-normal break-all text-xs italic text-neutral-500 dark:text-neutral-400">
                          This image is presented as a &quot;thumbnail&quot;
                          because it is protected by copyright. The museum
                          respects the rights of artists who retain the
                          copyright to their work.
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-full min-w-full">
              <DialogHeader className="">
                <DialogTitle className="z-50">
                  <span className="bg-opacity/50 rounded-lg bg-white px-4 py-3 dark:bg-neutral-900">
                    {item.title}
                  </span>
                </DialogTitle>
                {item?.image && (
                  <OpenSeaDragonViewer
                    image={getLargeImageUrl(selectedImage?.filename)}
                  />
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {sortedImages.length > 1 && (
        <div className="my-6 flex flex-wrap justify-start gap-2">
          {sortedImages.map(
            (image, index) =>
              image?.filename && (
                <div
                  key={index}
                  className={getThumbnailClass(image.filename)}
                  onClick={() => clickThumbnail(index)}
                >
                  <figure key={index}>
                    <Image
                      src={getRestrictedImageUrl(image.filename)}
                      className="max-h-16 object-contain"
                      alt=""
                      width={200}
                      height={200}
                    />
                    <figcaption></figcaption>
                  </figure>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
