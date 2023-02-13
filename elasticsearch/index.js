import fs from 'fs/promises';
import {createWriteStream} from 'fs'
import {readCsvFileToArray} from './csv.js';
import {importData} from './elasticsearch.js';

const inputPath = "./data/20221221_102750_object.jsonl";
const outputPath = "./data/transformed.jsonl";

function toStringArray(field, fieldName) {
  if (!Array.isArray(field)) return field
  let values = []
  for (const item of field) {
    values.push(item[fieldName])
  }
  return values;
}

function getPrimaryConstituent(obj) {
  if (!obj?.artists?.length) return null
  return obj.artists.find(o => o.role === 'Artist');
}

function getPrimaryApprovedLabel(obj) {
  if (!obj?.labels?.length) return null
  return obj.labels.find(o => o.approved_for_web === 1)?.content;
}

function getMuseumLocation(obj) {
  return obj?.museum_location?.name || null;
}

function getRightsType(obj) {
  return obj?.rights_type?.public_name || null;
}

function getElasticsearchSearchText(esObj) {
  return `${esObj.title} ${esObj.description}`;
}

function getElasticsearchKeywords(esObj) {
  return null;
}

function getElasticsearchBoostedKeywords(esObj) {
  return null;
}

function getElasticsearchObject(obj, images) {
  const esObj = {}
  esObj.type = 'object';
  esObj.url = `/collection/object/${obj.id}`
  esObj.id = obj.id;
  esObj.title = obj.title;
  esObj.description = getPrimaryApprovedLabel(obj);
  esObj.searchText = getElasticsearchSearchText(esObj);
  esObj.keywords = getElasticsearchKeywords(esObj);
  esObj.boostedKeywords = getElasticsearchBoostedKeywords(esObj);
  esObj.image = obj.primary_image;
  esObj.imageAlt = null;
  esObj.images = images;
  esObj.accessionNumber = obj.accession_number;
  esObj.accessionDate = obj.accessionDate;
  esObj.date = obj.object_date;
  esObj.startDate = obj.object_date_begin;
  esObj.endDate = obj.object_date_end;
  esObj.period = obj.period;
  esObj.dynasty = obj.dynasty;
  esObj.provenance = obj.provenance;
  esObj.medium = obj.medium;
  esObj.dimensions = obj.dimensions;
  esObj.edition = obj.edition;
  esObj.portfolio = obj.portfolio;
  esObj.markings = obj.markings;
  esObj.signed = obj.signed;
  esObj.inscribed = obj.inscribed;
  esObj.creditLine = obj.credit_line;
  esObj.copyright = obj.copyright;
  esObj.classification = obj.classification;
  esObj.publicAccess = obj.publicAccess ? true : false;
  esObj.copyrightRestricted = obj.copyright_restricted ? true : false;
  esObj.highlight = obj.highlight ? true : false;
  esObj.section = obj.section;
  esObj.museumLocation = getMuseumLocation(obj);
  esObj.rightsType = getRightsType(obj);
  esObj.labels = obj.labels;
  const primaryConstituent = getPrimaryConstituent(obj);
  esObj.primaryConstituent = primaryConstituent?.name;
  esObj.primaryConstituentRole = primaryConstituent?.role || null;
  esObj.constituents = toStringArray(obj.artists, 'name');
  esObj.collections = toStringArray(obj.collections, 'name');
  esObj.exhibitions = toStringArray(obj.exhibitions, 'title');
  esObj.geographicalLocations = toStringArray(obj.geographical_locations, 'name');
  delete obj.artists;
  return esObj;
}

async function getObjectImageData() {
  return readCsvFileToArray('./data/object_images.csv')
}

function getElasticsearchImages(objImgs, obj) {
  const id = `${obj.id}`;
  return objImgs.filter(o => o.object_id === id).map(h => {
    return {
      filename: h.filename,
      year: parseInt(h.date) || null,
      view: h.view,
      rank: parseInt(h.rank)
    }
  })
}

async function transformData() {
  const inputFile = await fs.open(inputPath);
  const outputStream = createWriteStream(outputPath) 
  const objImgs = await getObjectImageData();
  for await (const line of inputFile.readLines()) {
    const obj = JSON.parse(line);
    if (!obj?.id) continue;
    const images = getElasticsearchImages(objImgs, obj);
    const esObj = getElasticsearchObject(obj, images);
    outputStream.write(`${JSON.stringify(esObj)}\n`);
  }
}

async function run() {
  //await transformData();
  console.log('transformed data')
  await importData('collections', outputPath);
}

run();