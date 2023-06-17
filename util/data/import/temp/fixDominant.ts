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
    './data/BkM/json/collections.dominant.fixed.jsonl'
  );
  const fileStream = fs.createReadStream(
    './data/BkM/json/collections.dominant.jsonl'
  );
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.image?.dominantColorsHsl) {
      const newColors: any = [];
      for (const color of obj.image?.dominantColorsHsl) {
        const newColor = {
          // conert to h, s, l as integers
          h: Math.round(color[0] * 360),
          s: Math.round(color[1] * 100),
          l: Math.round(color[2] * 100),
        };
        newColors.push(newColor);
      }
      obj.image.dominantColorsHsl = newColors;
    }
    outputStream.write(`${JSON.stringify(obj)}\n`);
  }
}

async function run() {
  await updateHistograms();
}

run();
