'use client';

import { useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { SimilarCollectionObjectCard } from '@/components/collection-object/similar-collection-object-card';
import { Button } from '@/components/ui/button';

const SIMILAR_MAX_ITEMS = 24;
const SIMILAR_MIN_ITEMS = 12;

interface SimilarObjectsProps {
  title: string;
  similar: CollectionObjectDocument[];
  isMultiDataset: boolean;
}

export function SimilarCollectionObjectList({
  title,
  similar,
  isMultiDataset,
}: SimilarObjectsProps) {
  const dict = getDictionary();
  const [showAllSimilar, setShowAllSimilar] = useState(false);

  if (!similar || similar.length === 0) return null;

  return (
    <div className="bg-neutral-100 dark:bg-black">
      <section className="container pb-8 pt-6 md:py-8">
        <h3 className="mb-6 text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl">
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-6 pb-8 md:grid-cols-4 md:pb-10 lg:grid-cols-6">
          {similar?.length > 0 &&
            similar
              .slice(0, showAllSimilar ? SIMILAR_MAX_ITEMS : SIMILAR_MIN_ITEMS)
              .map(
                (item, i) =>
                  item && (
                    <div className="" key={i}>
                      <SimilarCollectionObjectCard
                        item={item}
                        isMultiDataset={isMultiDataset}
                      />
                    </div>
                  )
              )}
        </div>
        {!showAllSimilar && (
          <Button
            onClick={() => setShowAllSimilar(true)}
            variant="default"
            size="sm"
            aria-label={dict['artwork.showMore']}
          >
            {dict['artwork.showMore']}
          </Button>
        )}
      </section>
    </div>
  );
}
