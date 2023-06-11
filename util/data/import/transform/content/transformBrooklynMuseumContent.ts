import { type BaseDocument } from '@/types/baseDocument';
import { Transformable } from '@/types/transformable';

async function transform(doc: {
  [key: string]: any;
}): Promise<BaseDocument> {
  const cod = {} as BaseDocument;
  cod.type = 'page';
  cod.source = 'Brooklyn Museum';
  cod.id = doc.url;
  cod.url = doc.url;
  cod.title = doc.title;
  cod.searchText = doc.text;
  cod.keywords = doc.keywords;
  cod.imageUrl = doc.image;
  cod.imageThumbnailUrl = doc.image;
  return cod;
}

export const transformable: Transformable = {
  transform: transform,
};
