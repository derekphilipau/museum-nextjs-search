
const IMG_RESTRICTED_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/'
const IMG_SM_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/'
const IMG_LG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/'
export const NONE_IMG = '/static/img/bkm_black.png'

export function isImageRestricted(item) {
  return item.copyrightRestricted;
}

export function getSmallOrRestrictedImageUrl(filename, isCopyrightRestricted) {
  if (!filename) return NONE_IMG;
  if (isCopyrightRestricted)
    return getRestrictedImageUrl(filename);
  return getSmallImageUrl(filename);
}

export function getSmallImageUrl(filename) {
  if (!filename) return NONE_IMG;
  return `${IMG_SM_BASE_URL}${filename}`;
}

export function getRestrictedImageUrl(filename) {
  if (!filename) return NONE_IMG;
  return `${IMG_RESTRICTED_BASE_URL}${filename}`;
}

export function getLargeImageUrl(filename) {
  if (!filename) return NONE_IMG;
  return `${IMG_LG_BASE_URL}${filename}`;
}