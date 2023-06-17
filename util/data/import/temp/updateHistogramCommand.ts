/**
 * Import Elasticsearch data from JSON files.
 *
 * Temporary script, to be removed after the histogram data is added to the collections data import script.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/updateHistogramCommand.ts
 */
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as readline from 'node:readline';
import { getImageHistogramHSV } from '@/util/image';

function snooze(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

async function updateHistograms() {
  const outputStream = createWriteStream(
    './data/BkM/json/collections.hsvcolor.jsonl'
  );
  const fileStream = fs.createReadStream('./data/BkM/json/collections.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.image?.thumbnailUrl) {
      try {
        obj.imageHistogram = await getImageHistogramHSV(
          encodeURIComponent(obj.image?.thumbnailUrl)
        );
        console.log(obj.image?.thumbnailUrl);
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
