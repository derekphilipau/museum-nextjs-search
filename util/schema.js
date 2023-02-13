import { getSmallOrRestrictedImageUrl } from './image.js'

function getDimensionsCM(dimensions) {
  // H x W x D
  if (!(dimensions?.length > 0)) return {};
  const cm = dimensions.match(/\((.+?)\)/);
  if (cm?.length === 2) {
    const dim = cm[1].match(/\d+(\.\d{1,2})?/g);
    if (dim.length === 1) return { height: dim[0] }
    if (dim.length === 2) return { height: dim[0], width: dim[1] }
    if (dim.length === 3) return { height: dim[0], width: dim[1], depth: dim[2] }
  }
}

/**
 * https://schema.org/VisualArtwork
 */
export function getSchemaVisualArtwork(item) {
  if (!item) return '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork'
  };
  if (item.title) schema.name = item.title;
  if (item.image) schema.image = getSmallOrRestrictedImageUrl(item.image, item.copyrightRestricted);
  if (item.description) schema.abstract = item.description;
  if (item.primaryConstituent) {
    schema.creator = [{
      '@type': 'Person',
      name: item.primaryConstituent
    }];
  }
  if (item.medium) schema.medium = item.medum;
  if (item.medium) schema.artMedium = item.medum; // TODO
  if (item.classification) schema.artform = item.classification;
  const dimensions = getDimensionsCM(item.dimensions);
  if (dimensions?.height) schema.height = [{ '@type': 'Distance', 'name': `${dimensions.height} cm`}]
  if (dimensions?.width) schema.width = [{ '@type': 'Distance', 'name': `${dimensions.width} cm`}]
  if (dimensions?.depth) schema.depth = [{ '@type': 'Distance', 'name': `${dimensions.depth} cm`}]
  schema.accessMode = 'visual'; // TODO
  if (item.copyright) schema.copyrightNotice = item.copyright;
  if (item.creditLine) schema.creditText = item.creditLine;
  if (item.date) schema.dateCreated = item.date; // TODO
  schema.inLanguage = 'English'; // TODO
  if (item.keywords) schema.keywords = item.keywords;
  return schema;
}