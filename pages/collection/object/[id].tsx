import { useEffect, useState } from "react";
import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout/layout"
import { buttonVariants } from "@/components/ui/button"
import { ObjectDescription } from "@/components/search/object-description";
import { useRouter } from 'next/router'
import { ImageViewer } from "@/components/search/image-viewer";
import { SimilarItemCard } from "@/components/search/similar-item-card";
import { Button } from "@/components/ui/button";

import { getDocument } from "@/pages/api/util/elasticsearch.js";
import { similar } from "@/pages/api/util/elasticsearch.js";


export default function IndexPage({item, similar}) {
  const router = useRouter()
  const { id } = router.query

  const [visibleSimilar, setVisibleSimilar] = useState([]);
  const [showAllSimilar, setShowAllSimilar] = useState(false);

  useEffect(() => {
    if (showAllSimilar)
      setVisibleSimilar(similar);
    else
      setVisibleSimilar(similar.slice(0, 12));
  }, [similar, showAllSimilar]);

  useEffect(() => {
    setVisibleSimilar(similar.slice(0, 12));
  }, [router.query]);

  return (
    <Layout>
      <Head>
        <title>{item?.title} : Brooklyn Museum</title>
        <meta
          name="description"
          content="Elasticsearch + Next.js Search Prototype"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid md:grid-cols-2 lg:grid-cols-8 gap-6 pt-6 pb-8 md:py-10">
        <div className="md:col-span-1 lg:col-span-3 flex justify-center items-start">
        <ImageViewer item={item} />
        </div>
        <div className="md:col-span-1 lg:col-span-5">
          <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl mb-3">
            {item?.title}
          </h1>
          <div className="text-neutral-700 dark:text-neutral-400 mb-4">
            {item?.date}
          </div>
          <h2 className="text-lg md:text-xl mb-4">
            {item?.primaryConstituent || 'Maker Unknown'}
          </h2>
          <h4 className="font-semibold uppercase text-neutral-700 dark:text-neutral-400 mb-4">
            {item?.collections?.map(
              (collection, index) =>
                collection && (
                  <span>{collection}{(index > 0) ? ', ' : ''}</span>
                )
            )}
          </h4>
          <div className="text-neutral-700 dark:text-neutral-400 mb-4"
            dangerouslySetInnerHTML={{ __html: item?.description }}>
          </div>
          <div className="pt-4">
            <ObjectDescription item={item} />
          </div>
        </div>
      </section>
      <section className="container pt-6 pb-8 md:py-8 bg-neutral-100 dark:bg-neutral-800">
        <h2 className="text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl mb-6">
          Similar Objects
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-8 md:pb-10">
          {
            visibleSimilar?.length > 0 && visibleSimilar.map(
              (item, i) =>
                item && (
                  <div className="" key={i}>
                    <SimilarItemCard item={item} />
                  </div>
                )
            )
          }
        </div>
        {
          !showAllSimilar && (
            <Button
              onClick={() => setShowAllSimilar(true)}
              variant="default"
              size="sm"
            >
              Show more
            </Button>
          )
        }

      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const item = await getDocument('collections', id);
  const similarItems = await similar(id);
  return { props: { item: item.data, similar: similarItems } }
}