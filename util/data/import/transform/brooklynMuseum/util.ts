import { getBooleanValue } from '@/util/various';

export const OBJECT_TYPE = 'object';
export const CONTENT_TYPE = 'content';
export const ARCHIVE_TYPE = 'archive';
export const TERM_TYPE = 'term';

export const DOC_SOURCE = 'Brooklyn Museum';
export const NOT_ON_VIEW = 'This item is not on view';

const IMG_RESTRICTED_BASE_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/';
const IMG_SM_BASE_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/';
const IMG_LG_BASE_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/';

export function getSmallOrRestrictedImageUrl(
  filename: string | null | undefined,
  isCopyrightRestricted: boolean | string | undefined
) {
  if (!filename) return;
  if (getBooleanValue(isCopyrightRestricted))
    return getRestrictedImageUrl(filename);
  return getSmallImageUrl(filename);
}

export function getLargeOrRestrictedImageUrl(
  filename: string | null | undefined,
  isCopyrightRestricted?: boolean | string | undefined
) {
  if (!filename) return;
  if (getBooleanValue(isCopyrightRestricted))
    return getRestrictedImageUrl(filename);
  return getLargeImageUrl(filename);
}

export function getSmallImageUrl(filename: string | null | undefined) {
  if (!filename) return;
  return `${IMG_SM_BASE_URL}${filename}`;
}

export function getRestrictedImageUrl(filename: string | null | undefined) {
  if (!filename) return;
  return `${IMG_RESTRICTED_BASE_URL}${filename}`;
}

export function getLargeImageUrl(filename: string | null | undefined) {
  if (!filename) return;
  return `${IMG_LG_BASE_URL}${filename}`;
}
