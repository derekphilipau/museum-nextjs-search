import slugify from 'slugify';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';

/**
 * Strips basic html tags from a string
 *
 * @param html the string to strip html from
 * @returns the string with html tags removed
 */
export function stripBasicHtml(html) {
  if (!html) return '';
  return html.replace(/(<([^>]+)>)/gi, '');
}

/**
 * Strips line breaks from a string
 *
 * @param str the string to strip line breaks from
 * @param replaceStr defaults to a single space
 * @param replaceStr defaults to a single space
 * @returns the string with line breaks replaced with the replaceStr
 */
export function stripLineBreaks(str: string, replaceStr: string = ' ') {
  if (!str) return '';
  return str.replace(/(\r\n|\n|\r)/gm, replaceStr);
}

/**
 * Gets the caption for an image
 *
 * Caption is of the form:
 * Alma W. Thomas (American, 1891-1978). Wind, Sunshine and Flowers, 1968. Acrylic on canvas, 71 3/4 x 51 7/8 in. (182.2 x 131.8 cm). Brooklyn Museum, Gift of Mr. and Mrs. David K. Anderson, 76.120. © artist or artist's estate (Photo: Brooklyn Museum, 76.120_PS2.jpg)
 *
 * @param item the collection object
 * @param filename the filename of the image
 */
export function getCaption(
  item: CollectionObjectDocument,
  filename: string = ''
): string {
  if (!item) return '';
  let caption = '';
  caption += item?.primaryConstituent?.name
    ? `${item.primaryConstituent.name}. `
    : '';
  caption += item?.title ? `${item.title}, ` : '';
  caption += item?.formattedDate ? `${item.formattedDate}. ` : '';
  caption += item?.medium ? `${item.medium}, ` : '';
  caption += item?.dimensions ? `${item.dimensions}. ` : '';
  caption += item?.creditLine ? `${item.creditLine}, ` : '';
  caption += item?.accessionNumber ? `${item.accessionNumber}. ` : '';
  caption += item?.copyright ? `${item.copyright} ` : '';
  caption += item?.source ? `(Photo: ${item.source})` : '';
  return stripBasicHtml(stripLineBreaks(caption?.trim()));
}

/**
 * Gets the value of a boolean from a string or boolean, or return false.
 *
 * @param x the value to check
 * @returns  true if x is a boolean or a string that is 'true', false otherwise
 */
export function getBooleanValue(x: any) {
  if (typeof x === 'boolean') return x;
  if (typeof x === 'string') return x === 'true';
  if (typeof x === 'number') return x === 1;
  return false;
}

/**
 * TODO
 *
 * @param str the string to trim
 * @param length the length to trim to
 * @param ellipsis the string to append to the trimmed string
 * @returns
 */
export function trimStringToLengthAtWordBoundary(
  str: string,
  length: number,
  ellipsis: string = '...'
) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substr(0, str.lastIndexOf(' ', length)) + ellipsis;
}

export function getObjectUrlWithSlug(
  id: string | undefined,
  title: string | undefined
) {
  if (!id) return '';
  let url = `/collection/object/${id}`;
  if (title === undefined) return url;
  const slug = slugify(title, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: /[*+~.()'",!:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: 'en', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });
  if (slug) url += `/${slug}`;
  return url;
}
