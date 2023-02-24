import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { buttonVariants } from '@/components/ui/button';

export function AltNav() {
  return (
    <nav className="flex items-center space-x-1">
      <Link href={siteConfig.links.instagram} target="_blank" rel="noreferrer">
        <div
          className={buttonVariants({
            size: 'sm',
            variant: 'ghost',
            className: 'text-neutral-700 dark:text-neutral-400',
          })}
        >
          <Icons.instagram className="h-5 w-5" />
          <span className="sr-only">Instagram</span>
        </div>
      </Link>
      <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
        <div
          className={buttonVariants({
            size: 'sm',
            variant: 'ghost',
            className: 'text-neutral-700 dark:text-neutral-400',
          })}
        >
          <Icons.twitter className="h-5 w-5 fill-current" />
          <span className="sr-only">Twitter</span>
        </div>
      </Link>
      <ThemeToggle />
    </nav>
  );
}
