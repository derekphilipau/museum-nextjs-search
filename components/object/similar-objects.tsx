'use client';

import { useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';
import { SimilarObjectCard } from '@/components/search/similar-object-card';
import { Button } from '@/components/ui/button';

const SIMILAR_MAX_ITEMS = 24;
const SIMILAR_MIN_ITEMS = 12;

interface SimilarObjectsProps {
  title: string;
  similar: CollectionObjectDocument[];
}

export function SimilarObjects({ title, similar }: SimilarObjectsProps) {
  const dict = getDictionary();
  const [showAllSimilar, setShowAllSimilar] = useState(false);

  if (!similar || similar.length === 0) return null;

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800">
      <section className="container pt-6 pb-8 md:py-8">
        <h2 className="mb-6 text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-6 pb-8 md:grid-cols-4 md:pb-10 lg:grid-cols-6">
          {similar?.length > 0 &&
            similar.slice(0, (showAllSimilar ? SIMILAR_MAX_ITEMS : SIMILAR_MIN_ITEMS)).map(
              (item, i) =>
                item && (
                  <div className="" key={i}>
                    <SimilarObjectCard item={item} />
                  </div>
                )
            )}
        </div>
        {!showAllSimilar && (
          <Button
            onClick={() => setShowAllSimilar(true)}
            variant="default"
            size="sm"
            aria-label="Show More"
          >
            {dict['artwork.showMore']}
          </Button>
        )}
      </section>
    </div>
  );
}
