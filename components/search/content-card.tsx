import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';
import { NONE_IMG } from '@/util/image';

function getContainerClass(layout) {
  if (layout === 'grid') return 'py-4';
  return 'py-4 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-3';
}

function getDetailsClass(layout) {
  if (layout === 'grid') return 'pt-3';
  return 'lg:col-span-2';
}

export function ContentCard({ item, layout }) {
  if (!item || !item.url) return null;
  const dict = getDictionary();

  return (
    <Link href={item.url}>
      <div className={getContainerClass(layout)}>
        <div>
          {layout === 'grid' && (
            <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.content.itemTitle']}
            </h4>
          )}
          <div className="flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <figure>
              {item.image ? (
                <Image
                  src={item.image}
                  className="h-48 object-contain"
                  alt=""
                  width={400}
                  height={400}
                />
              ) : (
                <Image
                  src={NONE_IMG}
                  className="h-48 object-contain"
                  alt=""
                  width={400}
                  height={400}
                />
              )}
              <figcaption></figcaption>
            </figure>
          </div>
        </div>
        <div className={getDetailsClass(layout)}>
          {layout === 'list' && (
            <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.content.itemTitle']}
            </h4>
          )}
          <h4 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-white">
            {item.title}
          </h4>
          {item.date && (
            <p className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
              {item.date}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
