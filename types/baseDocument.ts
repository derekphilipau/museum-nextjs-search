

export interface DocumentConstituent {
  id?: string;
  name: string;
  dates?: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string[];
  gender?: string;
  role?: string;
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

export interface DocumentImageHslColor {
  h: number;
  s: number;
  l: number;
}

export interface DocumentImage {
  url?: string;
  thumbnailUrl?: string;
  alt?: string;
  dominantColorsHsl?: DocumentImageHslColor[][];
  histogram?: number[];
  year?: number;
  view?: string;
  rank?: number;
}

export interface BaseDocument {
  type: string;
  source?: string;
  url?: string;
  id: number;
  title?: string;
  description?: string;
  searchText?: string;
  keywords?: string;
  boostedKeywords?: string;
  primaryConstituent?: DocumentConstituent;
  image?: DocumentImage;
  date?: string;
  startDate?: string;
  endDate?: string;
}
