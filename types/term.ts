/**
 * An ES term
 */
export interface Term {
  index: string;
  field: string;
  value: string | null;
  alternates?: string[] | null;
  data?: any;


}