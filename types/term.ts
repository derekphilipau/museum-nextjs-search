/**
 * An ES term
 */
export interface Term {
  id: string;
  source: string;
  sourceId: string;
  sourceType?: string | null;
  index: string;
  field: string;
  value: string | null;
  preferred?: string | null;
  alternates?: string[] | null;
  summary?: string | null;
  description?: string | null;
  data?: any;
}