import type { BaseDocument } from '@/types/baseDocument';

export interface DocumentTransform {
  (obj: any, hasMutlipleDatasets: boolean): Promise<BaseDocument | undefined>;
}