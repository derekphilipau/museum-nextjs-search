import * as fs from 'fs';
import * as readline from 'node:readline';

import { getClient } from './client';
import {
  ELASTICSEARCH_BULK_LIMIT,
  ERR_CLIENT,
  bulk,
  createIndex,
  snooze,
} from './import';

/**
 * Return an array or a single value from a Dublin Core property.
 * If the property is an array, return a unique array of values.
 *
 * @param metadata Dublin Core metadata
 * @param property Name of the property
 * @returns Array of values or a single value
 */
function getDublinCoreProperty(metadata: any, property: string) {
  if (!metadata?.[property]) return undefined;
  if (Array.isArray(metadata?.[property])) {
    return [...new Set(metadata[property].map((o) => o['_']))];
  }
  return metadata[property]?.['_'];
}

function getDublinCoreUrlOrAccession(metadata: any, isAccession = true) {
  const id = getDublinCoreProperty(metadata, 'dc:identifier');
  if (id === undefined) return undefined;
  if (Array.isArray(id)) {
    if (isAccession) return id.find((id) => !id.startsWith('https'));
    return id.find((id) => id.startsWith('https'));
  }
  if (isAccession && !id.startsWith('https')) return id;
  if (!isAccession && id.startsWith('https')) return id;
  return undefined;
}

function getDublinCoreUrl(metadata: any) {
  return getDublinCoreUrlOrAccession(metadata, false);
}

function getDublinCoreId(metadata: any) {
  const url = getDublinCoreUrlOrAccession(metadata, false);
  if (url === undefined) return undefined;
  // Example URL:
  // "https://brooklynmuseum.libraryhost.com/repositories/2/archival_objects/29253"
  // Get the last part of the URL, the numeric ID, e.g. 29253
  return parseInt(url.split('/').pop());
}

function getDublinCoreAccession(metadata: any) {
  return getDublinCoreUrlOrAccession(metadata, true);
}

function getDates(metadata: any) {
  const date = getDublinCoreProperty(metadata, 'dc:date');
  // Date can be of form "1994", "1974 -- 1975", "1980-10", "1988-03-1988-05", "1988-1989"
  // Use regular expression if the date is of the form YYYY-MM:
  const match = /^(\d{4})-(\d{2})$/.exec(date);
  if (match?.length === 3) {
    const dateStr = `${match[1]}-${match[2]}-01`;
    // dang it, gotta do a date calculation now :(
    // TODO: import date-fns
    return {
      date,
      startDate: dateStr,
      endDate: dateStr,
    };
  }
  // Date is of the form YYYY-MM-YYYY-MM:
  const match2 = /^(\d{4})-(\d{2})\s*-+\s*(\d{4})-(\d{2})$/.exec(date);
  if (match2?.length === 5) {
    return {
      date,
      startDate: `${match2[1]}-${match2[2]}-01`,
      endDate: `${match2[3]}-${match2[4]}-01`,
    };
  }
  // Date is of the form YYYY-YYYY or YYYY -- YYYY:
  const match3 = /^(\d{4})\s*-+\s*(\d{4})$/.exec(date);
  if (match3?.length === 3) {
    return {
      date,
      startDate: `${match3[1]}-01-01`,
      endDate: `${match3[2]}-01-01`,
    };
  }
  return undefined;
}

function getLanguage(metadata: any) {
  const language = getDublinCoreProperty(metadata, 'dc:language');
  if (Array.isArray(language)) {
    // filter elements equal to "Latn":
    const langs = language.filter((l) => l !== 'Latn');
    // Get a new array where elements that equal "eng" or "English" are replaced with "en":
    const langCodes = langs.map((l) => {
      if (l === 'eng' || l === 'English') return 'en';
      // TODO: Check for other languages
      return l;
    });
    if (langCodes?.length === 1) return langCodes[0];
    return langCodes;
  }
}

function translateDublinCore(doc: any) {
  const md = doc?.metadata?.['oai_dc:dc'];
  if (md === undefined) return undefined;

  const id = getDublinCoreId(md);
  const url = getDublinCoreUrl(md);
  const accessionNumber = getDublinCoreAccession(md);
  const dates = getDates(md);

  return {
    type: 'dc_object',
    url,
    id,
    title: getDublinCoreProperty(md, 'dc:title'),
    description: getDublinCoreProperty(md, 'dc:description'),
    accessionNumber,
    primaryConstituent: getDublinCoreProperty(md, 'dc:creator'),
    subject: getDublinCoreProperty(md, 'dc:subject'),
    language: getLanguage(md),
    publisher: getDublinCoreProperty(md, 'dc:publisher'),
    format: getDublinCoreProperty(md, 'dc:format'),
    rights: getDublinCoreProperty(md, 'dc:rights'),
    relation: getDublinCoreProperty(md, 'dc:relation'),
    date: dates?.date,
    startDate: dates?.startDate,
    endDate: dates?.endDate,
  };
}

/**
 * Import data from a Dublin Core formatted jsonl file (one JSON object per row, no endline commas)
 *
 * @param indexName  Name of the index.
 * @param dataFilename  Name of the file containing the data.
 * @param idFieldName  Optional name of the field to use as the document ID.
 */
export async function importDublinCoreData(
  indexName: string,
  dataFilename: string,
  idFieldName: string
) {
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);
  await createIndex(client, indexName);
  const fileStream = fs.createReadStream(dataFilename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let documents: any[] = [];
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (obj !== undefined) documents.push(translateDublinCore(obj));
    if (documents.length >= ELASTICSEARCH_BULK_LIMIT) {
      await bulk(client, indexName, documents, idFieldName);
      documents = [];
      await snooze(2);
    }
  }
  if (documents.length > 0) {
    await bulk(client, indexName, documents, idFieldName);
  }
}
