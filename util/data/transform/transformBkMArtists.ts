import * as fs from 'fs';
import { createReadStream, createWriteStream } from 'fs';
import * as readline from 'node:readline';
import { options } from '@/util/elasticsearch/search/options';

import {
  artistTermsDataFile,
  collectionsDataFile,
  ulanArtistsFile,
  ulanCorporateBodiesFile,
} from '../dataFiles';

function cleanAlternateArtistName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/^(professor\s)/i, '')
    .replace(/&amp;\s/, '') // Remove ampersand code
    .replace(/\w+\.\s/, '') // Remove name abbreviations
    .replace(/,\s\w+\.$/, '') // Remove ending abbreviations
    .normalize('NFD') // Remove diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
}

function getStartEndDates(bio: string) {
  // Artist bios are in multiple formats, e.g.:
  // "American, 1727-1791, active in America 1746-1776"
  // "British painter, active 1758-ca. 1794"
  // "Mitch Epstein American, born 1952"
  // "Beverly Buchanan American, Fuquay-Varina, NC, born 1940, died 2015, Ann Arbor, MI"
  if (!bio) return null;
  const dates = bio.match(/\d{4}/g);
  if (dates && dates.length > 0) {
    // Return both first and second year:
    return {
      start: parseInt(dates?.[0]),
      end: parseInt(dates?.[1]),
    };
  }
  return null;
}

/**
 * Read each line /data/ULAN/ulanArtists.json file into an array of objects
 */
async function getJsonLData(filename: string): Promise<any[]> {
  const data: any[] = [];
  const inputStream = createReadStream(filename);
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = JSON.parse(line);
    data.push(obj);
  }
  return data;
}

function checkMatchedArtistTerms(ulanMatches, tmsDateObj) {
  if (ulanMatches?.length === 1) {
    // Great, found a single matching record for ULAN preferred term.
    return ulanMatches[0];
  } else if (ulanMatches?.length > 1) {
    // Found multiple matching records for ULAN preferred term.
    let temporaryConfirmedArtistTerm = null;
    for (const term of ulanMatches) {
      const ulanDateObj = getStartEndDates(term.summary);
      if (
        ulanDateObj?.start === tmsDateObj?.start &&
        ulanDateObj?.end === tmsDateObj?.end
      ) {
        // Both start and end dates match, great!
        return term;
      } else if (ulanDateObj?.start === tmsDateObj?.start) {
        // Only start date match, keep looping just in case there's a better match.
        temporaryConfirmedArtistTerm = term;
      }
    }
    if (temporaryConfirmedArtistTerm) {
      return temporaryConfirmedArtistTerm;
    }
  }
  return null;
}

async function correlate() {
  const ulanArtists = await getJsonLData(ulanArtistsFile);
  const ulanCorporateBodies = await getJsonLData(ulanCorporateBodiesFile);
  const outputStream = createWriteStream(artistTermsDataFile);
  const fileStream = fs.createReadStream(collectionsDataFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let artists: string[] = [];
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (obj?.primaryConstituent?.length > 0) {
      const artist = obj.primaryConstituent;
      const dates = obj.primaryConstituentDates;
      const tmsDateObj = getStartEndDates(dates);

      if (artists.includes(artist)) continue; // We've already encountered this artist
      artists.push(artist);
      const preferredTerms = ulanArtists.filter((a) => a.preferred === artist);
      let foundTerm = checkMatchedArtistTerms(preferredTerms, tmsDateObj);
      if (!foundTerm) {
        const alternateTerms = ulanArtists.filter(
          (a) => a.alternates?.length > 0 && a.alternates.includes(artist)
        );
        foundTerm = checkMatchedArtistTerms(alternateTerms, tmsDateObj);
      }
      if (!foundTerm) {
        const preferredCorporateTerms = ulanCorporateBodies.filter(
          (a) => a.preferred === artist
        );
        foundTerm = checkMatchedArtistTerms(
          preferredCorporateTerms,
          tmsDateObj
        );
        if (!foundTerm) {
          const alternateCorporateTerms = ulanCorporateBodies.filter(
            (a) => a.alternates?.length > 0 && a.alternates.includes(artist)
          );
          foundTerm = checkMatchedArtistTerms(
            alternateCorporateTerms,
            tmsDateObj
          );
        }
      }
      if (foundTerm) {
        const alternates: string[] = [];
        if (foundTerm.alternates?.length > 0) {
          const cleanArtist = cleanAlternateArtistName(artist);
          const cleanPreferred = cleanAlternateArtistName(foundTerm.preferred);
          for (const alt of foundTerm.alternates) {
            const cleanAlt = cleanAlternateArtistName(alt);
            if (
              cleanArtist.includes(cleanAlt) ||
              cleanPreferred.includes(cleanAlt)
            )
              continue;
            alternates.push(cleanAlt);
          }
        }
        const uniqueAlternates = [...new Set(alternates)]; // Remove duplicates
        const esTerm = {
          source: 'ULAN',
          sourceId: foundTerm.id,
          sourceType: foundTerm.type,
          field: 'primaryConstituent',
          value: artist,
          preferred: foundTerm.preferred,
          alternates: uniqueAlternates,
          summary: foundTerm.summary,
          description: foundTerm.description,
        };
        outputStream.write(`${JSON.stringify(esTerm)}\n`);
      } else {
        const esTerm = {
          source: 'TMS',
          sourceId: null,
          sourceType: 'constituent',
          field: 'primaryConstituent',
          value: artist,
          preferred: null,
          alternates: null,
          summary: null,
          description: null,
        };
        outputStream.write(`${JSON.stringify(esTerm)}\n`);
      }
    }
  }
}

export async function createArtistTerms() {
  await correlate();
}
