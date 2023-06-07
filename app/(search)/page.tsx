import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';

import { buttonVariants } from '@/components/ui/button';

export default function Page() {
  const dict = getDictionary();

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          {dict['home.title']}
        </h1>
        <p className="max-w-[700px] text-lg text-neutral-700 dark:text-neutral-400 sm:text-xl">
          {dict['home.summary']}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={dict['home.button.link']}
          className={buttonVariants({ size: 'lg' })}
        >
          {dict['home.button.label']}
        </Link>
      </div>
    </section>
  );
}
