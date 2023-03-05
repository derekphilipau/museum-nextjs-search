/**
 * For use with http://ulandownloads.getty.edu/ ULAN XML files.
 */
import * as fs from 'fs';
import * as readline from 'node:readline';
import * as xml2js from 'xml2js';

const parser = new xml2js.Parser();

const ulanFilenames = [
  './data/ULAN/ulan_xml_0622/ULAN1.xml',
  './data/ULAN/ulan_xml_0622/ULAN2.xml',
  './data/ULAN/ulan_xml_0622/ULAN3.xml',
  './data/ULAN/ulan_xml_0622/ULAN4.xml',
  './data/ULAN/ulan_xml_0622/ULAN5.xml',
];

const outputFilename = './data/ULAN/ulanArtists.json';

export interface UlanTerm {
  id: string;
  preferred?: string | null;
  alternates?: string[] | null;
  summary?: string | null;
  description?: string | null;
}

function cleanAlternateArtistName(name: string): string {
  if (!name) return '';
  return name
    .replace(/^(professor\s)/i, '')
    .replace(/&amp;\s/, '') // Remove ampersand code
    .replace(/\w+\.\s/, '') // Remove name abbreviations
    .replace(/,\s\w+\.$/, '') // Remove ending abbreviations
    .normalize('NFD') // Remove diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
}

function transformSubject(ulan): UlanTerm | undefined {
  const subject = ulan?.Subject;
  const id = subject?.['$']?.Subject_ID;
  if (!subject || !id) return;

  let description: string | null = null;
  if (subject?.Descriptive_Notes?.length > 0) {
    for (const notes of subject.Descriptive_Notes) {
      const language = notes?.Descriptive_Note?.[0].Note_Language?.[0];
      const text = notes?.Descriptive_Note?.[0].Note_Text?.[0];
      if (language === 'English' && text) {
        description = text;
        break;
      }
    }
  }

  let preferredTerm: string | null = null;
  let nonPreferredTerms: string[] | null = null;
  if (subject?.Terms[0]) {
    if (subject.Terms[0]?.Preferred_Term?.[0]) {
      preferredTerm = subject.Terms[0].Preferred_Term[0]?.Term_Text?.[0];
    }
    if (subject.Terms[0]?.['Non-Preferred_Term']?.length > 0) {
      for (const term of subject.Terms[0]['Non-Preferred_Term']) {
        if (term?.Term_Text[0]) {
          if (!nonPreferredTerms) nonPreferredTerms = [];
          nonPreferredTerms.push(term.Term_Text[0]);
        }
      }
    }
  }

  if (preferredTerm === null) return;
  if (nonPreferredTerms?.length === 0) nonPreferredTerms = null;

  let biography = null;
  if (subject?.Biographies?.[0]?.Preferred_Biography?.length > 0) {
    const bio = subject.Biographies[0].Preferred_Biography[0];
    if (bio?.Biography_Text?.[0]) {
      biography = bio.Biography_Text[0];
    }
  }

  return {
    id,
    preferred: preferredTerm,
    alternates: nonPreferredTerms,
    summary: biography,
    description,
  };
}

async function writeJsonSubject(xmlSubject: string) {
  const subject = await parser.parseStringPromise(xmlSubject);
  const esObj = transformSubject(subject);
  if (esObj) {
    fs.writeFileSync(outputFilename, JSON.stringify(esObj) + '\n', {
      flag: 'a',
    });
  }
}

async function parseULANXMLFile(filename: string) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let xmlSubject: string = '';
  for await (const line of rl) {
    if (line.match(/<Subject Subject_ID="(\d+)">/)) {
      xmlSubject = line + '\n';
    } else if (xmlSubject && line) {
      if (line.match(/<\/Subject>/)) {
        xmlSubject += line + '\n';
        await writeJsonSubject(xmlSubject);
        xmlSubject = '';
      } else if (line.match(/<Parent_String>.*<\/Parent_String>/)) {
        if (
          !line.match(
            /<Parent_String>Persons, Artists \[\d+\]<\/Parent_String>/
          )
        ) {
          xmlSubject = '';
        } else {
          xmlSubject += line + '\n';
        }
      } else {
        xmlSubject += line + '\n';
      }
    }
  }
}

export async function convert() {
  fs.writeFileSync(outputFilename, '', { flag: 'w' });
  for (const filename of ulanFilenames) {
    await parseULANXMLFile(filename);
  }
}
