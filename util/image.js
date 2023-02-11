
const IMG_RESTRICTED_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/'
const IMG_SM_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/'
const IMG_LG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/'

export async function isImageRestricted(image) {
  const result = await fetch(`${IMG_LG_BASE_URL}${image}`, { method: 'HEAD' });
  return !result.ok;
}

export async function getSmallOrRestrictedImageUrl(image) {
  const isRestricted = await isImageRestricted(image);
  if (isRestricted) return getRestrictedImageUrl(image);
  return getSmallImageUrl(image);
}


export function getSmallImageUrl(image) {
  return `${IMG_SM_BASE_URL}${image}`
}

export function getRestrictedImageUrl(image) {
  return `${IMG_RESTRICTED_BASE_URL}${image}`
}

export function getLargeImageUrl(image) {
  return `${IMG_LG_BASE_URL}${image}`
}