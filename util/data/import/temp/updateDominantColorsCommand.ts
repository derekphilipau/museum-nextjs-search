/**
 * Import Elasticsearch data from JSON files.
 *
 * Temporary script, to be removed after the dominant color data is added to the collections data import script.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/updateDominantColorsCommand.ts


{
  "id": 121640,
  "image": "30.1478.25_PS1.jpg",
  "dominantColorsHsl": [
    { "h": 17, "s": 38, "l": 43 },
    { "h": 10, "s": 51, "l": 32 },
    { "h": 37, "s": 43, "l": 76 },
    { "h": 19, "s": 30, "l": 50 },
    { "h": 177, "s": 14, "l": 27 },
    { "h": 41, "s": 33, "l": 72 }
  ]
}


*/
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as readline from 'node:readline';
import Vibrant from 'node-vibrant';

function snooze(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

async function updateDominantColors() {
  const outputStream = createWriteStream(
    './data/BrooklynMuseum/calculatedFields/dominantColorsHsl.jsonl'
  );
  
  const fileStream = fs.createReadStream('./data/BrooklynMuseum/collections.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.imageThumbnailUrl) {
      try {
        const imageUrl = encodeURIComponent(obj.imageThumbnailUrl);
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
  await updateDominantColors();
}

run();
