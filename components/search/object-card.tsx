import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';
import { getDictionary } from '@/dictionaries/dictionaries';
import { NONE_IMG, getSmallOrRestrictedImageUrl } from '@/util/image';
import { trimStringToLengthAtWordBoundary } from '@/util/various';

function getContainerClass(layout) {
  if (layout === 'grid') return 'py-4';
  return 'py-4 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-3';
}

function getDetailsClass(layout) {
  if (layout === 'grid') return 'pt-3';
  return 'lg:col-span-2';
}

export function ObjectCard({ item, layout, showType }) {
  if (!item) return null;
  const dict = getDictionary();

  const primaryConstituent = item.primaryConstituent || 'Maker Unknown';

  const slug = slugify(item?.title, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: /[*+~.()'",!:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: true,     // strip special characters except replacement, defaults to `false`
    locale: 'en',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  })

  const href = `/collection/object/${item.id}/${slug}`;

  return (
    <Link href={href}>
      <div className={getContainerClass(layout)}>
        <div>
          {showType && layout === 'grid' && (
            <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.collections.itemTitle']}
            </h4>
          )}
          <div className="flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <figure>
              {item.image ? (
                <Image
                  src={getSmallOrRestrictedImageUrl(
                    item.image,
                    item.copyrightRestricted
                  )}
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
          {showType && layout === 'list' && (
            <h4 className="mb-2 text-base font-semibold uppercase text-neutral-500 dark:text-neutral-600">
              {dict['index.collections.itemTitle']}
            </h4>
          )}
          <h4 className="mb-2 text-xl font-semibold">
            {item.title}
            {item.date ? `, ${item.date}` : ''}
          </h4>
          <h5 className="text-lg">{primaryConstituent}</h5>
          {item.primaryConstituentDates && (
            <span className="text-sm text-neutral-700 dark:text-neutral-400">
              {item.primaryConstituentDates}
            </span>
          )}
          {layout === 'list' && (
            <p>{trimStringToLengthAtWordBoundary(item.description, 200)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
