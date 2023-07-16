export interface DocumentConstituent {
  id?: string;
  name: string;
  prefix: string;
  suffix: string;
  dates?: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string[];
  gender?: string;
  role?: string;
  rank?: number;
  source?: string;
  sourceId?: string;
  wikiQid?: string;
  ulanId?: string;
}

export interface DocumentGeographicalLocation {
  id?: string;
  name: string;
  continent?: string;
  country?: string;
  type?: string;
}

export interface DocumentMuseumLocation {
  id?: string;
  name: string;
  isPublic?: boolean;
  isFloor?: boolean;
  parentId?: string;
}

export interface DocumentImageDominantColor {
  l: number;
  a: number;
  b: number;
  hex: string;
  percent: number;
}

export interface DocumentImage {
  id?: string;
  url?: string;
  thumbnailUrl?: string;
  alt?: string;
  dominantColors?: DocumentImageDominantColor[];
  embedding?: number[];
  date?: string;
  view?: string;
  rank?: number;
}

export interface BaseDocument {
  type: string;
  source?: string;
  url?: string;
  id: string;
  title?: string;
  description?: string;
  searchText?: string;
  keywords?: string;
  boostedKeywords?: string;
  primaryConstituent?: DocumentConstituent;
  image?: DocumentImage;
  date?: string;
  formattedDate?: string;
  startYear?: number;
  endYear?: number;
}
