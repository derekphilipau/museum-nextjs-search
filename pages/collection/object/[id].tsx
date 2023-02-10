import { useEffect, useState } from "react";
import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout/layout"
import { buttonVariants } from "@/components/ui/button"
import { ObjectDescription } from "@/components/search/object-description";
import { useRouter } from 'next/router'
import { ImageViewer } from "@/components/search/image-viewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function IndexPage() {
  const IMG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/'
  const [item, setItem] = useState(null);

  const router = useRouter()
  const { id } = router.query

  function getDocument() {
    const getData = async () => {
      const response = await fetch(`/api/document/${id}`, { method: "GET" });
      return response.json();
    };
    getData().then((res) => {
      console.log(res)
      setItem(res.data);
    });
  }

  useEffect(() => {
    if (!item && id) getDocument()
    console.log("loaded");
  });

  return (
    <Layout>
      <Head>
        <title>Search : Brooklyn Museum</title>
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
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl mb-3">
            {item?.title}
          </h1>
          <div className="text-gray-700 dark:text-gray-400 mb-4">
            {item?.date}
          </div>
          <h2 className="text-lg md:text-xl mb-4">
            {item?.primaryConstituent || 'Unknown Maker'}
          </h2>
          <h4 className="font-semibold uppercase text-gray-700 dark:text-gray-400 mb-4">
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
    </Layout>
  )
}
