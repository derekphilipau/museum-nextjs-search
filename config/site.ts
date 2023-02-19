import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  organization?: {
    address1?: string
    address2?: string
  }
  mainNav: NavItem[]
  links: {
    twitter?: string
    instagram?: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Brooklyn Museum",
  description: "Elasticsearch + Next.js Search Prototype",
  organization: {
    address1: "200 Eastern Parkway",
    address2: "Brooklyn, New York 11238-6052",
  },
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
  },
}