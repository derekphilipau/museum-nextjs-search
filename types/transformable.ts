import type { BaseDocument } from '@/types/baseDocument';

export interface Transformable {
  transform(obj: any): Promise<BaseDocument>;
}
