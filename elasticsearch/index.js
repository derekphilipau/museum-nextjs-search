import {importData} from './elasticsearch.js';

const index = 'collections';
const outputPath = './data/collections.jsonl';
const idField = 'id';

async function run() {
  await importData(index, outputPath, idField);
}

run();