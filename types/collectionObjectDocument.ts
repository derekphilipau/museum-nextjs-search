import type { BaseDocument } from './baseDocument';
import type { CollectionObjectImage } from './collectionObjectImage';

export interface CollectionObjectGeographicalLocation {
  id: number;
  name: string;
  type: string;
}

export interface CollectionObjectDocument extends BaseDocument {
  images?: CollectionObjectImage[];
  accessionNumber?: string;
  period?: string;
  dynasty?: string;
  provenance?: string;
  medium?: string;
  dimensions?: string;
  edition?: string;
  portfolio?: string;
  markings?: string;
  signed?: string;
  inscribed?: string;
  creditLine?: string;
  copyright?: string;
  classification?: string;
  publicAccess?: boolean;
  copyrightRestricted?: boolean;
  highlight?: boolean;
  section?: string;
  museumLocation?: string;
  rightsType?: string;
  labels?: string[];
  primaryConstituent?: string;
  primaryConstituentDates?: string;
  primaryConstituentRole?: string;
  collections?: string[];
  exhibitions?: string[];
  geographicalLocations?: CollectionObjectGeographicalLocation[];
  primaryGeographicalLocationContinent?: string;
  primaryGeographicalLocationCountry?: string;
  primaryGeographicalLocation?: string;
  primaryGeographicalLocationType?: string;
}
