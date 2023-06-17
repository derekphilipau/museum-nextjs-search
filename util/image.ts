import convert from 'color-convert';
import getPixels from 'get-pixels';

/**
 * Normalize the input vector using the Euclidean (L2) norm.
 * The resulting vector has a length of 1, and its direction is the same as the input vector.
 * This normalization is useful for cosine similarity-based comparisons.
 *
 * @param {number[]} vector - The input vector to normalize.
 * @returns {number[]} The normalized vector.
 */
export function normalizeVector(vector: number[]): number[] {
  const sum = vector.reduce((acc, val) => acc + val ** 2, 0);
  const magnitude = Math.sqrt(sum);
  return vector.map((val) => val / magnitude);
}

/**
 * Deprecated:  Lab worked OK for color similarity, but it was difficult to search for
 * specific colors like yellow.  Switched to getImageHistogramHSV instead.
 *
 * Create a histogram of the Lab values of an image.
 * Normalize the histogram to a unit vector for use with Elasticsearch cosine similarity.
 *
 * @param url The URL of the image to create a histogram for.
 * @returns A normalized histogram of the HSV values of the image.
 */
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

/**
 * Create a histogram of the HSV values of an image, prioritizing hue.
 * 64 bins for hue, 16 bins for saturation, and 16 bins for value.
 * Normalize the histogram to a unit vector for use with Elasticsearch cosine similarity.
 *
 * @param url The URL of the image to create a histogram for.
 * @returns A normalized histogram of the HSV values of the image.
 */
export async function getImageHistogramHSV(
  url: string | undefined
): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    if (!url) return [];
    getPixels(url, function (err: Error, pixels: any) {
      if (err) {
        return reject(err);
      }
      const histogram: number[] = new Array(64 + 16 + 16).fill(0);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];

        // Convert RGB to Lab
        const [h, s, v] = convert.rgb.hsv(red, green, blue);

        // Quantize the HSV values to fit the histogram bins
        const h_quantized = Math.floor(h / (360 / 64)) % 64; // Use more bins for hue
        const s_quantized = Math.floor(s / (100 / 16)) % 16;
        const v_quantized = Math.floor(v / (100 / 16)) % 16;

        histogram[h_quantized]++;
        histogram[s_quantized + 64]++;
        histogram[v_quantized + 80]++;
      }
      // Normalize the histogram
      const normalizedHistogram = normalizeVector(histogram);
      resolve(normalizedHistogram);
    });
  });
}
