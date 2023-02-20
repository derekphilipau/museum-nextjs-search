import Script from 'next/script';
import { ObjectDescription } from "@/components/search/object-description";
import { ImageViewer } from "@/components/search/image-viewer";
import { getDocument } from "@/util/elasticsearch";
import { LanguageDisclaimer } from "@/components/search/language-disclaimer";
import { getSmallOrRestrictedImageUrl } from "@/util/image";
import { SimilarObjects } from "@/components/object/similar-objects";
import { getSchemaVisualArtworkJson } from "@/util/schema";
import type { Metadata } from 'next';
import { getCaption } from "@/util/various";
import {encode} from 'html-entities';
import type { CollectionObject } from '@/types/collectionObject';
import type { ApiResponseDocument } from '@/types/apiResponseDocument';

async function getCollectionObject(id: number):Promise<ApiResponseDocument> {
  const data = await getDocument('collections', id);
  return data;
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getCollectionObject(params.id);
  const collectionObject = data?.data;
  if (!collectionObject) return {};

  const caption = encode(getCaption(collectionObject));
  const thumb = getSmallOrRestrictedImageUrl(collectionObject?.image, collectionObject?.copyrightRestricted);

  return {
    title: collectionObject.title,
    description: caption,
    openGraph: {
      title: collectionObject.title || '',
      description: caption,
      images: [
        {
          url: thumb
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  const data = await getCollectionObject(params.id);
  const collectionObject = data?.data;
  const similarCollectionObjects = data?.similar;
  const jsonLd = getSchemaVisualArtworkJson(collectionObject);

  return (
    <>
      <section className="container grid gap-y-6 gap-x-12 pt-6 pb-8 md:grid-cols-2 md:py-10 lg:grid-cols-8">
        <div className="flex items-start justify-center md:col-span-1 lg:col-span-3">
          <ImageViewer item={collectionObject} />
        </div>
        <div className="md:col-span-1 lg:col-span-5">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
            {collectionObject?.title}
          </h1>
          <div className="mb-4 text-neutral-700 dark:text-neutral-400">
            {collectionObject?.date}
          </div>
          <h2 className="text-lg md:text-xl">
            {collectionObject?.primaryConstituent || 'Maker Unknown'}
          </h2>
          {
            collectionObject?.primaryConstituentDates && (
              <div className="mb-4 text-sm text-neutral-700 dark:text-neutral-400">
                {collectionObject?.primaryConstituentDates}
              </div>  
            )        
          }
          <h4 className="mb-4 font-semibold uppercase text-neutral-700 dark:text-neutral-400">
            {collectionObject?.collections?.map(
              (collection, i) =>
                collection && (
                  <span key={i}>{collection}{(i > 0) ? ', ' : ''}</span>
                )
            )}
          </h4>
          <div className="mb-4 text-neutral-700 dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: collectionObject?.description || '' }}>
          </div>
          <div className="pt-4">
            <ObjectDescription item={collectionObject} />
          </div>
          <div>
            <LanguageDisclaimer item={collectionObject} />
          </div>
        </div>
      </section>
      <SimilarObjects similar={similarCollectionObjects} />
      {/* https://beta.nextjs.org/docs/guides/seo */}
      <Script
        id="json-ld-script"
        type="application/ld+json"
      >{jsonLd}</Script>
    </>
  )
}
