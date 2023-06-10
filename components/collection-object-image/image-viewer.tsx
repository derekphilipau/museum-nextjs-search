'use client';

import { useCallback, useEffect, useState, Key } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getCaption } from '@/util/various';
import useEmblaCarousel from 'embla-carousel-react';

import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const OpenSeaDragonViewer = dynamic(() => import('./open-seadragon-viewer'), {
  ssr: false,
});

export function ImageViewer({ item }) {
  const images = item?.images;
  const [selectedImage, setSelectedImage] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedImage(images?.[embla.selectedScrollSnap()]);
  }, [embla, images]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    onSelect();
  }, [embla, onSelect]);

  if (!item || !item?.id || !(item?.images?.length > 0)) return null;

  function getThumbnailClass(imageThumbnailUrl) {
    const base = 'flex w-16 items-center justify-center p-1 cursor-pointer';
    if (imageThumbnailUrl === selectedImage?.imageThumbnailUrl)
      return `${base} border border-neutral-400`;
    return base;
  }

  function clickImage(index) {
    setSelectedImage(images?.[index]);
    if (!item?.copyrightRestricted) setOpen(true);
  }

  function clickThumbnail(index) {
    setSelectedImage(images?.[index]);
    if (!embla) return;
    embla.scrollTo(index);
  }

  return (
    <div className="flex flex-col items-center">
      {images?.length > 0 && (
        <div className="relative">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {images.map(
                (image, index) =>
                  image.filename && (
                    <div
                      key={index}
                      className="embla__slide min-w-0"
                      style={{ flex: '0 0 100%' }}
                      onClick={() => clickImage(index)}
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 hidden group-hover:block">
                          <Icons.expand className="h-5 w-5 fill-current" />
                        </div>
                        <figure key={index}>
                          <Image
                            src={image.imageThumbnailUrl}
                            className={
                              item.copyrightRestricted
                                ? 'max-h-96 object-contain'
                                : 'max-h-96 cursor-pointer object-contain'
                            }
                            alt=""
                            width={800}
                            height={800}
                          />
                        </figure>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            {getCaption(item, selectedImage?.filename)}
            {item.copyrightRestricted && (
              <p className="mt-4 text-xs italic text-neutral-500 dark:text-neutral-400">
                This image is presented as a &quot;thumbnail&quot; because it is
                protected by copyright. The museum respects the rights of
                artists who retain the copyright to their work.
              </p>
            )}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-full min-w-full">
              <DialogHeader className="">
                <DialogTitle className="z-50">
                  <span className="bg-white px-4 py-3 dark:bg-neutral-900">
                    {item.title}
                  </span>
                </DialogTitle>
              </DialogHeader>
              {selectedImage.imageUrl && (
                <div className="h-64">
                  <OpenSeaDragonViewer
                    image={selectedImage.imageUrl}
                  />
                </div>
                )}
            </DialogContent>
          </Dialog>
        </div>
      )}
      {images.length > 1 && (
        <div className="my-6 flex flex-wrap justify-start gap-2">
          {images.map(
            (image, index: Key) =>
              image?.filename && (
                <div
                  key={index}
                  className={getThumbnailClass(image.imageThumbnailUrl)}
                  onClick={() => clickThumbnail(index)}
                >
                  <figure key={index}>
                    <Image
                      src={image.imageThumbnailUrl}
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
