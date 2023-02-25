import type { BasicDocument } from './basicDocument';
import type { CollectionObjectImage } from './collectionObjectImage';

export interface CollectionObjectDocument extends BasicDocument {
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
  geographicalLocations?: any[];
  primaryGeographicalLocationContinent?: string;
  primaryGeographicalLocationCountry?: string;
  primaryGeographicalLocation?: string;
  primaryGeographicalLocationType?: string;
}
