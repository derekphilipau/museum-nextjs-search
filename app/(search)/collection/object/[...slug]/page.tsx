import type { Metadata } from 'next';
import Script from 'next/script';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getDocument } from '@/util/elasticsearch/search/document';
import { getSmallOrRestrictedImageUrl } from '@/util/image';
import { getSchemaVisualArtworkJson } from '@/util/schema';
import { getCaption } from '@/util/various';
import { encode } from 'html-entities';

import type { ApiResponseDocument } from '@/types/apiResponseDocument';
import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { SimilarObjects } from '@/components/object/similar-objects';
import { ImageViewer } from '@/components/search/image-viewer';
import { LanguageDisclaimer } from '@/components/search/language-disclaimer';
import { ObjectDescription } from '@/components/search/object-description';
import { MuseumMap } from '@/components/museum-map/museum-map';

async function getCollectionObject(id: number): Promise<ApiResponseDocument> {
  const data = await getDocument('collections', id);
  return data;
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const id = params.slug[0];
  const data = await getCollectionObject(id);
  const collectionObject = data?.data as CollectionObjectDocument;
  if (!collectionObject) return {};

  const caption = encode(getCaption(collectionObject));
  const thumb = getSmallOrRestrictedImageUrl(
    collectionObject?.image,
    collectionObject?.copyrightRestricted
  );

  return {
    title: collectionObject.title,
    description: caption,
    openGraph: {
      title: collectionObject.title || '',
      description: caption,
      images: [
        {
          url: thumb,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const id = params.slug[0];
  const data = await getCollectionObject(id);
  const collectionObject = data?.data as CollectionObjectDocument;
  const similarCollectionObjects = data?.similar as CollectionObjectDocument[];
  const similarImageHistogram =
    data?.similarImageHistogram as CollectionObjectDocument[];
  const jsonLd = getSchemaVisualArtworkJson(collectionObject);
  const dict = getDictionary();

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
          {collectionObject?.primaryConstituentDates && (
            <div className="mb-4 text-sm text-neutral-700 dark:text-neutral-400">
              {collectionObject?.primaryConstituentDates}
            </div>
          )}
          <h4 className="mb-4 font-semibold uppercase text-neutral-700 dark:text-neutral-400">
            {collectionObject?.collections?.map(
              (collection, i) =>
                collection && (
                  <span key={i}>
                    {collection}
                    {i > 0 ? ', ' : ''}
                  </span>
                )
            )}
          </h4>
          <div
            className="mb-4 text-neutral-700 dark:text-neutral-400"
            dangerouslySetInnerHTML={{
              __html: collectionObject?.description || '',
            }}
          ></div>
          <div className="lg:flex pt-4 gap-x-4">
            <div>
            <ObjectDescription item={collectionObject} />
            </div>
            <div className="flex-0 mt-4">
              <MuseumMap item={collectionObject} />
            </div>
          </div>
          <div>
            <LanguageDisclaimer
              item={collectionObject}
              formId={process.env.FORMSPREE_FORM_ID}
            />
          </div>
        </div>
      </section>
      <SimilarObjects
        title={dict['object.similar']}
        similar={similarCollectionObjects}
      />

      <SimilarObjects
        title={dict['object.similarHistogram']}
        similar={similarImageHistogram}
      />

      {/* https://beta.nextjs.org/docs/guides/seo */}
      <Script id="json-ld-script" type="application/ld+json">
        {jsonLd}
      </Script>
    </>
  );
}
