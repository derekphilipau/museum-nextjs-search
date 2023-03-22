/**
 * Import Elasticsearch data from JSON files.
 *
 * Temporary script, to be removed after the histogram data is added to the collections data import script.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/updateHistogramCommandNormalize.ts
 */
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as readline from 'node:readline';
import { normalizeVector } from '@/util/image';

import { collectionsDataFile } from '../dataFiles';

async function updateHistograms() {
  const outputStream = createWriteStream(collectionsDataFile + '.new');
  const fileStream = fs.createReadStream(collectionsDataFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.imageHistogram) {
      const normalizedVector = normalizeVector(obj.imageHistogram);
      obj.imageHistogram = normalizedVector;
    }
    outputStream.write(`${JSON.stringify(obj)}\n`);
  }
}

async function run() {
  await updateHistograms();
}

run();
