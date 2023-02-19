import { NavItem } from "@/types/nav"

interface SiteConfig {
  defaultLocale: string
  mainNav: NavItem[]
  links: {
    twitter?: string
    instagram?: string
  }
}

export const siteConfig: SiteConfig = {
  defaultLocale: "en",
  mainNav: [
    {
      dict: "nav.home",
      href: "/",
    },
    {
      dict: "nav.search",
      href: "/search/collections?hasPhoto=true",
    },
  ],
  links: {
    twitter: "https://twitter.com/brooklynmuseum",
    instagram: "https://www.instagram.com/brooklynmuseum",
  },
}