/**
 * Import Elasticsearch data from JSON files.
 *
 * Temporary script, to be removed after the dominant color data is added to the collections data import script.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/updateHistogramCommand.ts
 */
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as readline from 'node:readline';
import convert from 'color-convert';
import Vibrant from 'node-vibrant';

const CLOUD_URL =
  'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/';

function snooze(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

async function updateHistograms() {
  const outputStream = createWriteStream(
    './data/BkM/json/collections.dominant.jsonl'
  );
  const fileStream = fs.createReadStream('./data/BkM/json/collections.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.image) {
      try {
        const imageUrl = CLOUD_URL + encodeURIComponent(obj.image);
        const palette = await Vibrant.from(imageUrl).getPalette();
        console.log(palette);
        const colors: any = [];
        for (const swatch in palette) {
          const hsl = palette?.[swatch]?.hsl;
          if (hsl) colors.push(hsl);
        }
        obj.dominantColorsHsl = colors;
        console.log(obj.dominantColorsHsl);
        await snooze(0.1);
      } catch (error) {
        console.error(error);
      }
    }
    outputStream.write(`${JSON.stringify(obj)}\n`);
  }
}

async function run() {
  await updateHistograms();
}

run();
