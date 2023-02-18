import Script from 'next/script';
import { getDocument } from "@/util/elasticsearch";
import { getSchemaVisualArtworkJson } from "@/util/schema"
import { getCaption } from "@/util/various.js";
import { getSmallOrRestrictedImageUrl } from "@/util/image";

export default async function Head({ params }) {
  const { id } = params;
  const data = await getDocument('collections', id);
  const item : any = data?.data;

  const thumb = getSmallOrRestrictedImageUrl(item?.image, item?.copyrightRestricted);
  const jsonLd = getSchemaVisualArtworkJson(item);

  return (
    <>
      <title>{item?.title} : Brooklyn Museum</title>
      <meta
        name="description"
        content="Elasticsearch + Next.js Search Prototype"
      />
      <meta name="description" content={getCaption(item)} key="desc" />
      <meta property="og:title" content={item?.title} />
      <meta property="og:description" content={getCaption(item)} />
      <meta property="og:image" content={thumb} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      {/*
      https://github.com/vercel/next.js/issues/42519
      <Script
        id="json-ld-script"
        type="application/ld+json"
      >{jsonLd}</Script>
       */}
    </>
  )
}
