import type { BasicDocument } from "./basicDocument";
import type { CollectionObjectDocument } from "./collectionObjectDocument";
import type { Term } from "./term";

export interface ApiResponseDocument {
  query?: any;
  data?: BasicDocument | CollectionObjectDocument | Term;
  similar?: CollectionObjectDocument[];
}
