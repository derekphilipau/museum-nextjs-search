import {useEffect, useState} from "react";
import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout/layout"
import { buttonVariants } from "@/components/ui/button"

import { useRouter } from 'next/router'

export default function IndexPage() {
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
        <div className="md:col-span-1 lg:col-span-3 flex justify-center">
          <figure>
            <img className="max-h-96" src={`https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/${item?.image}`} alt="" />
            <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption>
          </figure>
        </div>
        <div className="md:col-span-1 lg:col-span-5">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl mb-6">
            {item?.title}
          </h1>
          <p className="text-neutral-700 dark:text-neutral-400"
            dangerouslySetInnerHTML={{__html: item?.description}}>
          </p>
          <pre className="max-w-[980px] break-normal">
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>
      </section>
    </Layout>
  )
}
