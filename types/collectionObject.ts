import { CollectionObjectImage } from "./collectionObjectImage"

export interface CollectionObject {
  type: string;
  url: string;
  id: number;
  title?: string;
  description?: string;
  searchText?: string;
  keywords?: string;
  boostedKeywords?: string;
  image?: string;
  imageAlt?: string;
  images?: CollectionObjectImage[];
  accessionNumber?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
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
  primaryConstituentRole?: string;
  constituents?: string[];
  collections?: string[];
  exhibitions?: string[];
  geographicalLocations?: string[];
}
