
const IMG_RESTRICTED_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/'
const IMG_SM_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/'
const IMG_LG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/'
const NONE_IMG = '/img/bkm_black.png'

export function isImageRestricted(item) {
  return item.copyrightRestricted;
}

export function getSmallOrRestrictedImageUrl(item) {
  if (!item.image) return NONE_IMG;
  if (item.copyrightRestricted)
    return getRestrictedImageUrl(item.image);
  return getSmallImageUrl(item.image);
}

export function getSmallImageUrl(image) {
  if (!image) return NONE_IMG;
  return `${IMG_SM_BASE_URL}${image}`;
}

export function getRestrictedImageUrl(image) {
  if (!image) return NONE_IMG;
  return `${IMG_RESTRICTED_BASE_URL}${image}`;
}

export function getLargeImageUrl(image) {
  if (!image) return NONE_IMG;
  return `${IMG_LG_BASE_URL}${image}`;
}