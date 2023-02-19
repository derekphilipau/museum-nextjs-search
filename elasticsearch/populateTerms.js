import fs from 'fs/promises';
import {createWriteStream} from 'fs'
import {options, importData} from './elasticsearch';

const outputPath = "./data/terms.jsonl";

async function getTerms(index, field) {
  const terms = await options({index, field, q: ''}, 10000)
  return terms
    .filter(t => t.key !== 'Unknown' && t.key !== '(not assigned)')
    .map(t => {
      return {
        index,
        field,
        value: t.key,
        count: t.doc_count  
      }
  });
}

async function transformData() {
  const outputStream = createWriteStream(outputPath) 
  const artists = await getTerms('collections', 'primaryConstituent');
  const classification = await getTerms('collections', 'classification');
  const collections = await getTerms('collections', 'collections');
  const allTerms = [...artists, ...classification, ...collections];
  for await (const term of allTerms) {
    outputStream.write(`${JSON.stringify(term)}\n`);
  }
}

async function run() {
  //await transformData();
  console.log('transformed data')
  await importData('terms', outputPath);
}

run();