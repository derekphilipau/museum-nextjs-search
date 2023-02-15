import fs from 'fs/promises';
import {createWriteStream} from 'fs'
import {readCsvFileToArray} from './csv.js';
import {importData} from './elasticsearch.js';

const outputPath = "./data/content.jsonl";

async function getPageData() {
  return readCsvFileToArray('./data/Pruned_URLS.csv')
}

function getElasticsearchContent(c) {
  return {
    type: 'page',
    url: c.URL,
    id: c.URL,
    title: c.Title,
    image: c.Image,
    searchText: c.Description,
    keywords: c.Keywords
  }
}

async function transformData() {
  const pages = await getPageData();
  const outputStream = createWriteStream(outputPath) 
  for await (const page of pages) {
    outputStream.write(`${JSON.stringify(getElasticsearchContent(page))}\n`);
  }
}

async function run() {
  await transformData();
  console.log('transformed data')
  await importData('content', outputPath, 'id');
}


run();