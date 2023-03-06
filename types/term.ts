/**
 * An ES term
 */
export interface Term {
  source: string;
  sourceId: string;
  sourceType: string;
  field: string;
  value: string | null;
  preferred?: string | null;
  alternates?: string[] | null;
  summary?: string | null;
  description?: string | null;
}