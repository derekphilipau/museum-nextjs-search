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
  };

  if (obj.labels?.length) {
    for (const label of obj.labels) {
      if (label.approved_for_web === 1) {
        cod.description = label.content;
      }
    }
  }

  cod.searchText = obj.accession_number;
  cod.accessionNumber = obj.accession_number; // "14.301a-e"
  cod.accessionDate = new Date(obj.accession_date).toISOString(); // "1915-11-06 00:00:00"
  cod.date = obj.date; // "18th century"
  cod.startDate = obj.object_date_begin; // "1700"
  cod.endDate = obj.object_date_end; // "1799"
  cod.period = obj.period; // "Qianlong Period"
  cod.dynasty = obj.dynasty; // "Qing Dynasty"
  cod.medium = obj.medium; // "Carved jade and hardstone"
  cod.provenance = obj.provenance;
  cod.dimensions = obj.dimensions;
  cod.edition = obj.edition;
  cod.portfolio = obj.portfolio;
  cod.inscribed = obj.inscribed; // TODO: Line endings: "松芝多秀色\r\n鶴語記春秋\r\n福如東海島\r\n蓬萊赴蟠桃\r\n\r\nThe pine trees and lingzhi fungi form a beautiful scenery;\r\nThe crane’s call is a record of the Spring and Autumn period;\r\nWith happiness as boundless as the eastern seas and islands;\r\nI attend a banquet of immortality peaches on the Penglai isles.\r\n\r\nInscribed by order of the Qianlong emperor.\r\n\r\n"
  cod.creditLine = obj.credit_line;
  cod.copyright = obj.copyright;
  cod.classification = obj.classification; // "Vessel"
  cod.publicAccess = obj.public_access === 1;
  cod.copyrightRestricted = obj.copyright_restricted === 1;
  cod.section = obj.section;
  cod.highlight = obj.highlight === 1;
  cod.onView = false;
  if (obj.museum_location?.name === NOT_ON_VIEW) {
    cod.museumLocation = {
      name: NOT_ON_VIEW,
      isPublic: false,
      isFloor: false,
    };
  } else if (obj.museum_location?.id) {
    cod.onView = true;
    cod.museumLocation = {
      id: obj.museum_location.id,
      name: obj.museum_location.name,
      isPublic: obj.museum_location.is_public === 1,
      isFloor: obj.museum_location.is_floor,
      parentId: obj.museum_location.parent_location_id,
    };
  }

  if (obj.rights_type?.name !== '(not assigned)') {
    cod.rightsType = obj.rights_type?.public_name;
  }
  cod.completeness = obj.completeness.percentage;

  if (obj.artists?.length) {
    cod.constituents = obj.artists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      prefix: artist.prefix, // Role adjective: "Attributed to"
      suffix: artist.suffix, // Mixed bag: "School", "or", "Style", "Northern"
      dates: artist.dates,
      birthYear: artist.start_year,
      deathYear: artist.end_year,
      nationality: [artist.nationality], // "American"
      role: artist.role,
      rank: artist.rank,
      source: DOC_SOURCE,
      sourceId: artist.id,
    }));
    if (cod.constituents?.length) {
      if (cod.constituents.length === 1) {
        cod.primaryConstituent = cod.constituents[0];
      } else {
        // Most rankings are zero-based, but constituents seems one-based?
        cod.primaryConstituent = cod.constituents.find((c) => c.rank === 0);
        if (!cod.primaryConstituent) {
          cod.primaryConstituent = cod.constituents.find((c) => c.rank === 1);
        }
      }
    }
  }

  cod.collections = obj.collections?.map((collection: any) => collection.name);
  cod.exhibitions = obj.exhibitions?.map((exhibition: any) => exhibition.title);
  cod.relatedObjects = obj.related_items?.map(
    (related: any) => related.object_id
  );

  if (obj.geographical_locations?.length) {
    // TODO: get continent, country, etc.
    cod.geographicalLocations = obj.geographical_locations.map(
      (location: any) => ({
        id: location.id,
        name: location.name,
        continent: location.continent,
        country: location.country,
        type: location.type,
      })
    );
    if (cod.geographicalLocations?.length) {
      cod.primaryGeographicalLocation = cod.geographicalLocations[0];
    }
  }

  let primaryImageInArray = true;
  if (obj.primary_image) {
    const myImage = obj.images.find(
      (image: any) => image.filename === obj.primary_image
    );
    if (!myImage) {
      // Sometimes primary image isn't in list of all images
      primaryImageInArray = false;
      cod.image = {
        id: obj.primary_image,
        url: getLargeOrRestrictedImageUrl(
          obj.primary_image,
          cod.copyrightRestricted
        ),
        thumbnailUrl: getSmallOrRestrictedImageUrl(
          obj.primary_image,
          cod.copyrightRestricted
        ),
        rank: 0, // should always be zero
      };
    } else {
      cod.image = {
        id: myImage.id,
        url: getLargeOrRestrictedImageUrl(
          myImage.filename,
          cod.copyrightRestricted
        ),
        thumbnailUrl: getSmallOrRestrictedImageUrl(
          myImage.filename,
          cod.copyrightRestricted
        ),
        alt: myImage.alt,
        date: myImage.date,
        view: myImage.view,
        rank: 0, // should always be zero
      };
    }
  }

  if (obj.images) {
    if (!primaryImageInArray) {
      // If primary image wasn't in list of all images, add it
      obj.images.unshift({
        id: obj.primary_image,
        filename: obj.primary_image,
        rank: 0,
      });
    }
    const unsortedImages = obj.images.map((image: any) => ({
      id: image.id,
      url: getLargeOrRestrictedImageUrl(
        image.filename,
        cod.copyrightRestricted
      ),
      thumbnailUrl: getSmallOrRestrictedImageUrl(
        image.filename,
        cod.copyrightRestricted
      ),
      alt: image.alt,
      date: image.date,
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
