import type { BaseDocument } from '@/types/baseDocument';

export interface DocumentTransform {
  (obj: any, isMultiTenant: boolean): Promise<BaseDocument | undefined>;
}