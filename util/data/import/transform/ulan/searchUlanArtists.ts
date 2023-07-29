import { loadJsonFile } from '@/util/jsonUtil';

import type { UlanArtist } from '@/types/ulanArtist';

const ULAN_ARTISTS_FILE = './data/ULAN/json/ulanArtists.jsonl.gz';
let ULAN_ARTISTS: UlanArtist[];
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
  ULAN_ARTISTS = await loadJsonFile(ULAN_ARTISTS_FILE);

  for (const c of ULAN_ARTISTS) {
    c.normalizedPreferredTerm = normalizeName(c.preferredTerm);
    if (c.nonPreferredTerms?.length)
      c.normalizedNonPreferredTerms = c.nonPreferredTerms.map((n) =>
        normalizeName(n)
      );
    else c.normalizedNonPreferredTerms = [];

    c.normalizedTermWords = getWords([
      c.normalizedPreferredTerm,
      ...c.normalizedNonPreferredTerms,
    ]);
  }
  console.log(`ULAN Artists loaded ${ULAN_ARTISTS.length} entries`);
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

function getExactPreferredTermMatch(
  normalizedName: string,
  birthYear?: number,
  deathYear?: number
) {
  const preferredTerms = ULAN_ARTISTS.filter(
    (a) => a.normalizedPreferredTerm === normalizedName
  );
  if (preferredTerms?.length)
    return selectUlanMatch(preferredTerms, birthYear, deathYear);
}

function getExactNonPreferredTermMatch(
  normalizedName: string,
  birthYear?: number,
  deathYear?: number
) {
  const alternateTerms = ULAN_ARTISTS.filter(
    (a) =>
      a.normalizedNonPreferredTerms?.length &&
      a.normalizedNonPreferredTerms.includes(normalizedName)
  );
  if (alternateTerms?.length)
    return selectUlanMatch(alternateTerms, birthYear, deathYear);
}

function getHighestWordCountTermMatch(normalizedName: string) {
  const normalizedConstituentWords = getUniqueWords(normalizedName);

  let maxCommonWords = 0;
  let bestMatch: UlanArtist | undefined;

  for (const ulanRecord of ULAN_ARTISTS) {
    let commonWords = 0;

    for (const word of normalizedConstituentWords) {
      commonWords += countOccurrences(ulanRecord.normalizedTermWords, word);
    }

    if (commonWords > maxCommonWords) {
      maxCommonWords = commonWords;
      bestMatch = ulanRecord;
    }
  }

  // sanity check:  make sure at least one word matches the preferred term:
  if (bestMatch?.normalizedPreferredTerm && maxCommonWords > 0) {
    const preferredTermWords = getUniqueWords(
      bestMatch.normalizedPreferredTerm
    );
    for (const word of normalizedConstituentWords) {
      if (countOccurrences(preferredTermWords, word) > 0) {
        return bestMatch;
      }
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

  if (!ULAN_ARTISTS) {
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

  let ulanArtist = getExactPreferredTermMatch(
    normalizedConstituentName,
    birthYear,
    deathYear
  );
  if (!ulanArtist) {
    ulanArtist = getExactNonPreferredTermMatch(
      normalizedConstituentName,
      birthYear,
      deathYear
    );
  }
  if (!ulanArtist) {
    // Too permissive, don't use
    // ulanArtist = getHighestWordCountTermMatch(normalizedConstituentName);
  }

  if (ulanArtist) {
    // console.log(`ULAN "${normalizedConstituentName}" => "${ulanArtist.preferredTerm}"`)
    ULAN_ARTIST_CACHE[normalizedConstituentName] = ulanArtist;
  } else {
    // record that we already tried to find this name but failed
    ULAN_ARTIST_CACHE[normalizedConstituentName] = { id: 'Not Found' };
  }
  return ulanArtist;
}
