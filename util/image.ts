import convert from 'color-convert';
import getPixels from 'get-pixels';

import { getBooleanValue } from './various';

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

export function normalizeVector(vector: number[]): number[] {
  const sum = vector.reduce((acc, val) => acc + val ** 2, 0);
  const magnitude = Math.sqrt(sum);
  return vector.map((val) => val / magnitude);
}

export async function getImageHistogram(
  url: string | undefined
): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    if (!url) return [];
    getPixels(url, function (err: Error, pixels: any) {
      if (err) {
        return reject(err);
      }
      const histogram: number[] = new Array(32 * 3).fill(0);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];

        // Convert RGB to Lab
        const [L, a, b] = convert.rgb.lab(red, green, blue);

        // Quantize the Lab values to fit the histogram bins
        const L_quantized = Math.floor(L / 8);
        const a_quantized = Math.floor((a + 128) / 8);
        const b_quantized = Math.floor((b + 128) / 8);

        histogram[L_quantized]++;
        histogram[a_quantized + 32]++;
        histogram[b_quantized + 64]++;
      }
      // Normalize the histogram
      const normalizedHistogram = normalizeVector(histogram);
      resolve(normalizedHistogram);
    });
  });
}
