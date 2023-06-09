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
import { SimilarCollectionObjectList } from '@/components/collection-object/similar-collection-object-list';
import { ImageViewer } from '@/components/collection-object-image/image-viewer';
import { LanguageDisclaimer } from '@/components/collection-object/language-disclaimer';
import { CollectionObjectDescription } from '@/components/collection-object/collection-object-description';
import { MuseumMapDialog } from '@/components/museum-map/museum-map-dialog';

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
  const images = [getSmallOrRestrictedImageUrl(
    collectionObject?.image,
    collectionObject?.copyrightRestricted
  ) || ''];

  return {
    title: collectionObject.title,
    description: caption,
    openGraph: {
      title: collectionObject.title || '',
      description: caption,
      images,
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
          <div className="gap-x-4 pt-4 lg:flex">
            <div>
            <CollectionObjectDescription item={collectionObject} />
            </div>
            <div className="flex-0 my-4">
              <MuseumMapDialog item={collectionObject} />
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
      <SimilarCollectionObjectList
        title={dict['artwork.similar']}
        similar={similarCollectionObjects}
      />

      <SimilarCollectionObjectList
        title={dict['artwork.similarHistogram']}
        similar={similarImageHistogram}
      />

      {/* https://beta.nextjs.org/docs/guides/seo */}
      <Script id="json-ld-script" type="application/ld+json">
        {jsonLd}
      </Script>
    </>
  );
}
