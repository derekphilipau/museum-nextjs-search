import { type CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { Transformable } from '@/types/transformable';
import {
  DOC_SOURCE,
  NOT_ON_VIEW,
  OBJECT_TYPE,
  getLargeOrRestrictedImageUrl,
  getSmallOrRestrictedImageUrl,
} from './util';

/**
 * Sometimes the item's main image (item.image.url) is ranked at the same level
 * as other item images.  Force the main image to have the highest rank (0).
 */
function getSortedImages(images: any[], url: string | undefined) {
  if (!url || !images?.length) return images;
  const index = images.findIndex((o) => o.url === url);
  if (index !== -1 && images[index]?.rank) {
    images[index].rank = 0;
  }
  return images.sort((a, b) => (a.rank || 0) - (b.rank || 0));
}

async function transform(obj: any): Promise<CollectionObjectDocument> {
  const cod: CollectionObjectDocument = {
    // Begin BaseDocument fields
    type: OBJECT_TYPE,
    source: DOC_SOURCE,
    id: obj.id,
    title: obj.title,
    description: obj.description,
    searchText: obj.accessionNumber,
    // keywords unused
    // boostedKeywords unused
    primaryConstituent: {
      name: obj.primaryConstituent,
      dates: obj.primaryConstituentDates,
      role: obj.primaryConstituentRole,
    },
    // image (below)
    date: obj.date,
    startDate: obj.startDate,
    endDate: obj.endDate,
    // End BaseDocument fields
    constituents: (obj.constituents || []).map((constituent: any) => ({
      name: constituent.name,
    })),
    accessionNumber: obj.accessionNumber,
    accessionDate: obj.accessionDate,
    period: obj.period,
    dynasty: obj.dynasty,
    provenance: obj.provenance,
    medium: obj.medium,
    dimensions: obj.dimensions,
    edition: obj.edition,
    portfolio: obj.portfolio,
    markings: obj.markings,
    signed: obj.signed,
    inscribed: obj.inscribed,
    creditLine: obj.creditLine,
    copyright: obj.copyright,
    classification: obj.classification,
    publicAccess: obj.publicAccess,
    copyrightRestricted: obj.copyrightRestricted,
    highlight: obj.highlight,
    section: obj.section,
    museumLocation: obj.museumLocation,
    onView: obj.museumLocation && obj.museumLocation !== NOT_ON_VIEW,
    rightsType: obj.rightsType,
    labels: obj.labels,
    collections: obj.collections,
    exhibitions: obj.exhibitions,
    primaryGeographicalLocation: {
      name: obj.primaryGeographicalLocation,
      continent: obj.primaryGeographicalLocationContinent,
      country: obj.primaryGeographicalLocationCountry,
      type: obj.primaryGeographicalLocationType,
    },
    geographicalLocations: (obj.geographicalLocations || []).map(
      (location: any) => ({
        id: location.id,
        name: location.name,
        type: location.type,
      })
    ),
  };

  if (obj.image) {
    cod.image = {
      url: getLargeOrRestrictedImageUrl(obj.image, obj.copyrightRestricted),
      thumbnailUrl: getSmallOrRestrictedImageUrl(
        obj.image,
        obj.copyrightRestricted
      ),
      alt: obj.imageAlt,
      histogram: obj.imageHistogram,
      dominantColorsHsl: obj.dominantColorsHsl,
    };
  }

  if (obj.images) {
    const unsortedImages = obj.images.map((image: any) => ({
      url: getLargeOrRestrictedImageUrl(
        image.filename,
        obj.copyrightRestricted
      ),
      thumbnailUrl: getSmallOrRestrictedImageUrl(
        image.filename,
        obj.copyrightRestricted
      ),
      alt: image.alt,
      histogram: image.histogram,
      dominantColorsHsl: image.dominantColorsHsl,
      year: image.year,
      view: image.view,
      rank: image.rank,
    }));
    cod.images = getSortedImages(unsortedImages, cod.image?.url);
  }

  return cod;
}

export const transformable: Transformable = {
  transform,
};
