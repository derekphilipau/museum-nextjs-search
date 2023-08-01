import { loadJsonFile } from '@/util/jsonUtil';

import type { UlanArtist } from '@/types/ulanArtist';

const ULAN_ARTISTS_FILE = './data/ULAN/json/ulanArtists.jsonl.gz';
let ULAN_ARTISTS: any = {};
let ulanDataLoaded = false;
let ULAN_ARTIST_CACHE: { [key: string]: UlanArtist } = {};

/**
 * Normalizes a name for comparisons
 *
 * @param name ULAN Name to normalize
 * @returns Normalized name
 */
export function normalizeName(
  name: string | undefined,
  removeParentheticals = false
): string {
  if (!name) return '';
  if (removeParentheticals) name = name.replace(/\(.*?\)/g, '');
  return name
    .toLowerCase()
    .normalize('NFD') // Remove diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/^(professor\s)/i, '')
    .replace(/&amp;\s/, '') // Remove ampersand code
    .replace(/\w+\.\s/, '') // Remove name abbreviations
    .replace(/,\s\w+\.$/, '') // Remove ending abbreviations
    .replace(/\W+/g, ' ') // Remove all non-word characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

function getWords(values: string | string[]): string[] {
  const myValues = Array.isArray(values) ? values : [values];
  return myValues.flatMap((value) => value.split(' '));
}

function getUniqueWords(values: string | string[]): string[] {
  return Array.from(new Set(getWords(values)));
}

function countOccurrences(arr?: string[], word?: string): number {
  if (!arr || !word) return 0;
  return arr.reduce((acc, curr) => (curr === word ? acc + 1 : acc), 0);
}

async function loadUlanArtists() {
  const ulanArtistsRaw = await loadJsonFile(ULAN_ARTISTS_FILE);

  for (const artist of ulanArtistsRaw) {
    artist.normalizedPreferredTerm = normalizeName(artist.preferredTerm);
    if (artist.nonPreferredTerms?.length)
      artist.normalizedNonPreferredTerms =
        artist.nonPreferredTerms.map(normalizeName);
    else artist.normalizedNonPreferredTerms = [];

    if (ULAN_ARTISTS[artist.normalizedPreferredTerm])
      ULAN_ARTISTS[artist.normalizedPreferredTerm].push(artist);
    else
      ULAN_ARTISTS[artist.normalizedPreferredTerm] = [artist];

    for (const term of artist.normalizedNonPreferredTerms) {
      if (ULAN_ARTISTS[term])
        ULAN_ARTISTS[term].push(artist);
      else
        ULAN_ARTISTS[term] = [artist];
    }
  }
  console.log(`ULAN Artists loaded ${ulanArtistsRaw.length} entries`);
  ulanDataLoaded = true;
}

function selectUlanMatch(
  ulanMatches: UlanArtist[],
  birthYear?: number,
  deathYear?: number
): UlanArtist | undefined {
  if (ulanMatches?.length === 1) {
    // Great, found a single matching record for ULAN preferred term.
    return ulanMatches[0];
  } else if (ulanMatches?.length > 1 && birthYear && deathYear) {
    // Found multiple matching records for ULAN preferred term.
    // Try to find matching birth & death dates
    let temporaryConfirmedUlanArtist: UlanArtist | undefined;
    for (const ulanArtist of ulanMatches) {
      if (
        ulanArtist.birthDate &&
        ulanArtist.deathDate &&
        parseInt(ulanArtist.birthDate) === birthYear &&
        parseInt(ulanArtist.deathDate) === deathYear
      ) {
        return ulanArtist;
      } else {
        if (
          ulanArtist.deathDate &&
          parseInt(ulanArtist.deathDate) === deathYear
        ) {
          // Only end date match, keep looping just in case there's a better match.
          temporaryConfirmedUlanArtist = ulanArtist;
        }
        if (
          ulanArtist.birthDate &&
          parseInt(ulanArtist.birthDate) === birthYear
        ) {
          // Only start date match, keep looping just in case there's a better match.
          temporaryConfirmedUlanArtist = ulanArtist;
        }
      }
    }
    if (temporaryConfirmedUlanArtist) {
      return temporaryConfirmedUlanArtist;
    }
  }
}

/**
 * @param constituentName
 * @param birthYear
 * @param deathYear
 * @returns
 */
export async function searchUlanArtists(
  constituentName: string,
  birthYear?: number,
  deathYear?: number
): Promise<UlanArtist | undefined> {
  if (!constituentName?.length) return;

  if (!ulanDataLoaded) {
    await loadUlanArtists();
  }

  const normalizedConstituentName = normalizeName(constituentName, true);

  if (ULAN_ARTIST_CACHE[normalizedConstituentName]?.id) {
    if (ULAN_ARTIST_CACHE[normalizedConstituentName]?.id === 'Not Found') {
      return;
    }
    // console.log(`CACHE HIT ULAN "${normalizedConstituentName}"`)
    return ULAN_ARTIST_CACHE[normalizedConstituentName];
  }

  let ulanArtist: UlanArtist | undefined;
  const artistMatches = ULAN_ARTISTS[normalizedConstituentName];
  if (artistMatches) {
    ulanArtist = selectUlanMatch(artistMatches, birthYear, deathYear);
    if (ulanArtist) {
      ULAN_ARTIST_CACHE[normalizedConstituentName] = ulanArtist;
    }
  }
  if (!ulanArtist) {
    // record that we already tried to find this name but failed
    ULAN_ARTIST_CACHE[normalizedConstituentName] = { id: 'Not Found' };
  }
  return ulanArtist;
}
