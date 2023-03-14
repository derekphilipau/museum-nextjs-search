import { getBooleanValue } from './various';
import getPixels from 'get-pixels';

const IMG_RESTRICTED_BASE_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/';
const IMG_SM_BASE_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/';
const IMG_LG_BASE_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/';
export const NONE_IMG = '/static/img/bkm_black.png';

export function getSmallOrRestrictedImageUrl(
  filename: string | undefined,
  isCopyrightRestricted: boolean | string | undefined
) {
  if (!filename) return NONE_IMG;
  if (getBooleanValue(isCopyrightRestricted))
    return getRestrictedImageUrl(filename);
  return getSmallImageUrl(filename);
}

export function getSmallImageUrl(filename: string | undefined) {
  if (!filename) return NONE_IMG;
  return `${IMG_SM_BASE_URL}${filename}`;
}

export function getRestrictedImageUrl(filename: string | undefined) {
  if (!filename) return NONE_IMG;
  return `${IMG_RESTRICTED_BASE_URL}${filename}`;
}

export function getLargeImageUrl(filename: string | undefined) {
  if (!filename) return NONE_IMG;
  return `${IMG_LG_BASE_URL}${filename}`;
}

export async function getImageHistogram(url: string | undefined): Promise<number[]> {
  return new Promise((resolve, reject) => {
    if (!url) return [];
    getPixels(url, function(err, pixels) {
      if (err) {
        return reject(err);
      }
      const histogram = new Array(64 * 3).fill(0);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const red = Math.floor(pixels.data[i] / 4);
        const green = Math.floor(pixels.data[i + 1] / 4);
        const blue = Math.floor(pixels.data[i + 2] / 4);
        histogram[red]++;
        histogram[green + 64]++;
        histogram[blue + 128]++;
      }
      resolve(histogram);
    });
  });
}
