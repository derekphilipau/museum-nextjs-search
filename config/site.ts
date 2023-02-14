import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    instagram: string
    docs: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Search Prototype",
  description:
    "Elasticsearch + Next.js Search Prototype",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Search",
      href: "/search/collections?hasPhoto=true",
    },
  ],
  links: {
    twitter: "https://twitter.com/brooklynmuseum",
    instagram: "https://www.instagram.com/brooklynmuseum",
    docs: "https://ui.shadcn.com",
  },
}
