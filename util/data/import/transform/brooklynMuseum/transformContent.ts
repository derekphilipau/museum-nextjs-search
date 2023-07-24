import { type BaseDocument } from '@/types/baseDocument';
import { DocumentTransform } from '@/types/documentTransform';
import { CONTENT_TYPE, DOC_SOURCE } from './util';

export const transform: DocumentTransform = async function(
  doc: any,
  hasMutlipleDatasets: boolean
): Promise<BaseDocument | undefined> {
  return {
    type: CONTENT_TYPE,
    source: DOC_SOURCE,
    id: doc.url,
    url: doc.url,
    title: doc.title,
    searchText: doc.text,
    keywords: doc.keywords,
    image: {
      url: doc.image,
      thumbnailUrl: doc.image,
    },
  } as BaseDocument;
}