import type { DocumentGeographicalLocation, DocumentConstituent, DocumentImage, BaseDocument } from './baseDocument';

export interface CollectionObjectDocument extends BaseDocument {
  constituents?: DocumentConstituent[];
  images?: DocumentImage[];
  accessionNumber?: string;
  accessionDate?: string;
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
  onView?: boolean;
  rightsType?: string;
  labels?: string[];
  collections?: string[];
  exhibitions?: string[];
  primaryGeographicalLocation?: DocumentGeographicalLocation;
  geographicalLocations?: DocumentGeographicalLocation[];
}
