import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';

export interface Transformable {
  transform(obj: any): Promise<CollectionObjectDocument>;
}
