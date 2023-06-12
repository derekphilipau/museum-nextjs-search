import type { NavItem } from '@/types/nav';

interface SiteConfig {
  defaultLocale: string;
  mainNav: NavItem[];
  links?: {
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

export const siteConfig: SiteConfig = {
  defaultLocale: 'en',
  mainNav: [
    {
      dict: 'nav.search',
      href: '/search/collections?hasPhoto=true',
    },
  ],
  links: {
    github: 'https://github.com/derekphilipau/museum-nextjs-search',
    // twitter: 'https://twitter.com/xxx',
    // instagram: 'https://www.instagram.com/xxx',
  },
};
