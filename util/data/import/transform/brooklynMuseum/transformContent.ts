import { type BaseDocument } from '@/types/baseDocument';
import { Transformable } from '@/types/transformable';
import {
  CONTENT_TYPE,
  DOC_SOURCE,
} from './util';

async function transform(doc: {
  [key: string]: any;
}): Promise<BaseDocument> {
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

export const transformable: Transformable = {
  transform,
};
