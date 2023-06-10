import { type CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { Transformable } from '@/types/transformable';
import { getSmallOrRestrictedImageUrl, getLargeOrRestrictedImageUrl } from '@/util/image';

/**
 * Sometimes the item's main image (item.imageUrl) is ranked at the same level
 * as other item images.  Force the main image to have the highest rank (0).
 */
function getSortedImages(images: any[], imageUrl: string | undefined) {
  if (!imageUrl || !images?.length) return images;
  const index = images.findIndex((o) => o.imageUrl === imageUrl);
  if (index !== -1 && images[index]?.rank) {
    images[index].rank = 0;
  }
  return images?.sort((a, b) => (a.rank || 0) - (b.rank || 0)) || [];
}

async function transform(obj: {
  [key: string]: any;
}): Promise<CollectionObjectDocument> {
  const cod = obj as CollectionObjectDocument;

  cod.type = 'object';

  if (obj.museumLocation && obj.museumLocation !== 'This item is not on view')
    cod.onView = true;
  else cod.onView = false;

  cod.searchText = cod.accessionNumber + ' ' + cod.title + ' ' + cod.description;

  cod.keywords = undefined;
  cod.boostedKeywords = undefined; // Boosted Keywords are heavily weighted

  if (obj.image) {
    cod.imageUrl = getLargeOrRestrictedImageUrl(
      obj.image,
      obj.copyrightRestricted
    );
    cod.imageThumbnailUrl = getSmallOrRestrictedImageUrl(
      obj.image,
      obj.copyrightRestricted
    );
  }

  if (obj.images) {
    const unsortedImages = obj.images.map((image: any) => {
      image.imageUrl = getLargeOrRestrictedImageUrl(
        image.filename,
        obj.copyrightRestricted
      );
      image.imageThumbnailUrl = getSmallOrRestrictedImageUrl(
        image.filename,
        obj.copyrightRestricted
      );
      return image;
    });
    cod.images = getSortedImages(unsortedImages, cod.imageUrl);
  }

  return cod;
}

export const transformable: Transformable = {
  transform: transform,
};
