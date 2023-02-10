import Head from "next/head"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout/layout"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
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
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Search Prototype
          </h1>
          <p className="max-w-[700px] text-lg text-neutral-700 dark:text-neutral-400 sm:text-xl">
            Prototype Elasticsearch search built with Next.js 13, 
            Radix UI, and Tailwind CSS (via https://ui.shadcn.com/).
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/search"
            className={buttonVariants({ size: "lg" })}
          >
            Try the search!
          </Link>
        </div>
      </section>
    </Layout>
  )
}
