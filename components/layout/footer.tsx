import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';

import { Icons } from '@/components/icons';
import { Input } from '../ui/input';

export function Footer() {
  const dict = getDictionary(); // en

  return (
    <div className="container p-6">
      <nav className="my-10 md:flex md:items-center md:justify-between md:space-x-6">
        <div>
          <Link
            href="/"
            className="mb-2 flex items-center space-x-2 text-xl font-bold"
          >
            {dict['site.title']}
          </Link>
          <p className="mb-2 text-xs">
            {dict['organization.address1']}
            <br />
            {dict['organization.address2']}
          </p>
          <p className="text-xs">{dict['footer.text']}</p>
        </div>
        <div className="mt-6 md:mt-0">
          <h5 className="mb-2 text-lg">{dict['footer.marketing.text']}</h5>
          <Input
            name="marketing"
            placeholder={dict['footer.marketing.placeholder']}
          />
        </div>
      </nav>
    </div>
  );
}
