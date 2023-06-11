import type { BaseDocument } from './baseDocument';

export interface ArchiveDocument extends BaseDocument {
  accessionNumber?: string;
  primaryConstituent?: string;
  subject?: string;
  language?: string;
  publisher?: string;
  format?: string;
  rights?: string;
  relation?: string;
}
