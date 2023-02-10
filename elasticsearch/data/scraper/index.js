const { default: axios } = require("axios");
const fs = require('fs');
const util = require('util')

const sleep = ms => new Promise(r => setTimeout(r, ms));
const timestamp = getDateString();

const config = {
  headers:{
    api_key: 'lrHD2Wzzsx6pNfwzu8EF4UmtzF7cwPMc',
  }
};

async function getItems(type) {
  const limit = 30;
  let offset = 92970;
  const baseUrl = `https://www.brooklynmuseum.org/api/v2/${type}`;
  while (true) {
    const url = baseUrl + `?limit=${limit}&offset=${offset}`;
    console.log(`${type} fetch: ${url}`)
    const response = await axios.get(url, config);
    console.log(response.data); return;
    if (!response.data?.data?.length) break;
    console.log(`Got ${response.data.data.length} items`)
    for (const item of response.data.data) {
      fs.appendFileSync(`${timestamp}_${type}.jsonl`, JSON.stringify(item) + "\n")
    }
    offset = offset + limit;
    await sleep(4000);
  }
}

async function getAll() {
  await getItems('object');
}

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const seconds = `${date.getSeconds()}`.padStart(2, '0');
  return `${year}${month}${day}_${hour}${minutes}${seconds}`
}

getAll();
