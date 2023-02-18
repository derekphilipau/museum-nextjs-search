import { SiteHeader } from "@/components/layout/site-header"
import { Footer } from "@/components/layout/footer"
import Providers from "./Providers";
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="min-h-screen bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-900 dark:text-neutral-50">
        <Providers>
          <SiteHeader />
            <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}