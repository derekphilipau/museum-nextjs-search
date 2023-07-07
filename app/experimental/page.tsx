import { Key } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getClient } from '@/util/elasticsearch/client';
import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiResponseSearch } from '@/types/apiResponseSearch';
import type { BaseDocument } from '@/types/baseDocument';
import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { CollectionObjectCard } from '@/components/collection-object/collection-object-card';
import embeddings from './elasticsearch_test_embeddings_0.json';

export default async function Page({ params, searchParams }) {
  const images = [
    '7612',
    '7613',
    '7614',
    '7615',
    '7621',
    '7622',
    '7623',
    '7624',
    '7625',
    '7626',
    '7627',
    '7628',
    '7629',
    '7630',
    '7631',
    '7632',
    '7633',
    '7634',
    '7635',
    '7636',
    '7637',
    '7638',
    '7639',
    '7640',
    '7641',
    '7642',
    '7643',
    '7644',
    '7645',
    '7646',
    '7647',
    '7648',
    '7649',
    '7650',
    '7651',
    '7652',
    '7653',
    '7654',
    '7655',
    '7656',
    '7657',
    '7658',
    '7659',
  ];

  const index = 'collections';
  const image = searchParams?.image || '';

  let embedding: any = null;
  if (image) {
    embedding = embeddings.find((e) => e.id === image);
  }

  let items: any[] = [];
  if (!embedding?.embedding) {
  } else {
    const esQuery: T.SearchRequest = {
      index: 'collections',
      query: {
        bool: {
          must: [
            { exists: { field: 'image.embedding' } },
            {
              script_score: {
                query: { match_all: {} },
                script: {
                  source:
                    "cosineSimilarity(params.query_vector, 'image.embedding') + 1.0",
                  params: { query_vector: embedding.embedding },
                },
              },
            },
          ],
          filter: [
            {
              term: {
                onView: true,
              },
            },
          ],
        },
      },
      from: 0,
      size: 48,
    };

    const client = getClient();
    if (client === undefined) items = [];
    else {
      const response: T.SearchTemplateResponse = await client.search(esQuery);
      if (!response?.hits?.hits?.length) {
        items = [];
      }
      items = response.hits.hits.map(
        (h) => h._source as CollectionObjectDocument
      );
    }
  }

  return (
    <section className="container pt-4 md:pt-6">
      <div className="">
        <div className="sm:col-span-3 md:col-span-4">
          <div className="flex flex-wrap gap-2">
            {images?.length > 0 &&
              images.map(
                (image: any, i: Key) =>
                  image && (
                    <div className="w-24">
                      <Link href={`/experimental?image=${image}`}>
                        <Image
                          src={`/img/experimental/embeddings/${image}.jpg`}
                          className="w-full"
                          alt="test image"
                          width={200}
                          height={200}
                        />
                      </Link>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>

      <div className="gap-6 pb-8 pt-4 sm:grid sm:grid-cols-3 md:grid-cols-4 md:py-6">
        <div className="sm:col-span-3 md:col-span-4">
          <div className="relative my-4 grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:pb-10 lg:grid-cols-3">
            {items?.length > 0 &&
              items.map(
                (item: any, i: Key) =>
                  item && (
                    <div className="" key={i}>
                      {item.type === 'object' && (
                        <CollectionObjectCard
                          item={item}
                          layout="grid"
                          showType={false}
                          showColor={false}
                        />
                      )}
                    </div>
                  )
              )}
            {!(items?.length > 0) && (
              <h3 className="my-10 mb-4 text-lg md:text-xl">
                No results found
              </h3>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
