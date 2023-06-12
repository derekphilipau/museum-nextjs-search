import { NextRequest, NextResponse } from 'next/server';
import { transformable as archiveTransformable } from '@/util/data/import/transform/archives/transformBrooklynMuseumArchives';
import { transformable as collectionsTransformable } from '@/util/data/import/transform/collections/transformBrooklynMuseumCollectionObject';
import { transformable as contentTransformable } from '@/util/data/import/transform/content/transformBrooklynMuseumContent';
import { importJsonFileDataFromUrl } from '@/util/elasticsearch/importUrl';

const sharedKey = 'hDL4apAsIM7YUzCyYU8Y2AKtcMGlrR';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  const url = request.nextUrl;

  if (url.searchParams.get('sharedKey') !== sharedKey)
    return new Response('Unauthorized', { status: 401 });

  // URL: /api/protected/sync/[indexName]
  const indexName = url.pathname.split('/')[4];

  if (!indexName || !['all', 'collections', 'content', 'archives'].includes(indexName))
    return new Response('No index provided', { status: 400 });

  const response = await sync(indexName);

  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}

async function sync(indexName: string) {
  console.log('sync: ' + indexName);
  console.log('use cloud: ' + process.env.ELASTICSEARCH_USE_CLOUD);
  console.log('host: ' + process.env.ELASTICSEARCH_HOST);
  return;

  if (indexName === 'collections' || indexName === 'all')
    await importCollections();
  if (indexName === 'content' || indexName === 'all') await importContent();
  if (indexName === 'archives' || indexName === 'all') await importArchives();

  // TODO: log results to elasticsearch logs

  const response = {
    fetchedAt: Date.now(),
    indexName,
  };
  return response;
}

async function importCollections() {
  return await importJsonFileDataFromUrl(
    'collections',
    'id',
    collectionsTransformable.transform,
    true
  );
}

async function importContent() {
  return await importJsonFileDataFromUrl(
    'content',
    'id',
    contentTransformable.transform,
    true
  );
}

async function importArchives() {
  return await importJsonFileDataFromUrl(
    'archives',
    'id',
    archiveTransformable.transform,
    true
  );
}
