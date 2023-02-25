export interface BasicDocument {
  type: string;
  url: string;
  id: number;
  title?: string;
  description?: string;
  searchText?: string;
  keywords?: string;
  boostedKeywords?: string;
  constituents?: string[];
  image?: string;
  imageAlt?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}
