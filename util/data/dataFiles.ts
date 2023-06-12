
/*
 * The following should be deprecated in favor of URL accessed datafiles.
 */
export const termsDataFile = './data/BkM/json/terms.jsonl';
export const artistTermsDataFile = './data/BkM/json/artistTerms.jsonl';

export const ulanArtistsFile = './data/ULAN/json/ulanArtists.jsonl';
export const ulanCorporateBodiesFile =
  './data/ULAN/json/ulanCorporateBodies.jsonl';

export const ulanRawFilenames = [
  './data/ULAN/raw/ulan_xml_0622/ULAN1.xml',
  './data/ULAN/raw/ulan_xml_0622/ULAN2.xml',
  './data/ULAN/raw/ulan_xml_0622/ULAN3.xml',
  './data/ULAN/raw/ulan_xml_0622/ULAN4.xml',
  './data/ULAN/raw/ulan_xml_0622/ULAN5.xml',
];

/**
 * In an actual production environment, there would be some way to determine
 * the last succesfully updated datafile, and that file would be returned by
 * this function.
 */
export function getLatestDatafileUrlPath(name: string): string | undefined {
  if (name === 'collections')
    return '/data/BrooklynMuseum/collections_20230202_020124.jsonl.gz';
  if (name === 'content')
    return '/data/BrooklynMuseum/content_20230202_020124.jsonl.gz';
  if (name === 'archives')
    return '/data/BrooklynMuseum/archives_20230202_020124.jsonl.gz';
}