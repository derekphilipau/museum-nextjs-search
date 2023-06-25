import { getClient } from '@/util/elasticsearch/client';
import { ERR_CLIENT, bulk } from '@/util/elasticsearch/import';
import { searchAll } from '@/util/elasticsearch/search/search';
import dominantColors from '@/util/image/dominantColors';

const INDEX_NAME = 'collections';
const NUMBER_DOMINANT_COLORS = 8;

export async function updateDominantColors(forceUpdate: boolean = false) {
  const chunkSize = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '1000');
  const client = getClient();
  if (client === undefined) throw new Error(ERR_CLIENT);
  let documents: any[] = [];

  if (forceUpdate) {
    // Get all documents with images, regardless of whether we've already processed them
    documents = await searchAll(
      INDEX_NAME,
      { exists: { field: 'image.thumbnailUrl' } },
      ['id', 'image']
    );
  } else {
    // Get all documents with images that we haven't processed yet
    documents = await searchAll(
      INDEX_NAME,
      {
        bool: {
          must_not: [
            {
              exists: { field: 'image.dominantColors' },
            },
          ],
          must: [
            {
              exists: { field: 'image.thumbnailUrl' },
            },
          ],
        },
      },
      ['id', 'image']
    );
  }

  console.log(
    `Dominant Colors: Found ${documents.length} documents with images to analyze.`,
    `Update with force equal to ${forceUpdate}, chunk size ${chunkSize}.`
  );

  let documentsToUpdate: any[] = [];
  for (const document of documents) {
    if (!document.image?.thumbnailUrl) continue;
    const palette = await dominantColors(
      document.image.thumbnailUrl,
      NUMBER_DOMINANT_COLORS
    );
    console.log(
      `doc id ${document.id} image ${document.image.thumbnailUrl} has ${palette.length} colors`
    );

    const colors: any[] = [];
    for (const paletteColor of palette) {
      if (
        paletteColor.percent === 0 ||
        !paletteColor.lab.length ||
        paletteColor.lab[0] == null ||
        paletteColor.lab[1] == null ||
        paletteColor.lab[2] == null
      ) {
        continue;
      }
      colors.push({
        l: paletteColor.lab[0],
        a: paletteColor.lab[1],
        b: paletteColor.lab[2],
        hex: paletteColor.hex,
        percent: Math.round(paletteColor.percent * 100), // Convert to int, 0.51 -> 51
      });
    }
    if (colors.length > 0) {
      document.image.dominantColors = colors;
    }

    documentsToUpdate.push(document);

    if (documentsToUpdate.length >= chunkSize) {
      console.log('BULK UPDATE');
      await bulk(client, INDEX_NAME, documentsToUpdate, 'id', 'update');
      documentsToUpdate = [];
    }
  }

  if (documentsToUpdate.length > 0) {
    console.log('BULK UPDATE');
    await bulk(client, INDEX_NAME, documentsToUpdate, 'id', 'update');
  }
}
