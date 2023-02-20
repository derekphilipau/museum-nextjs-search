"use client"
import { useEffect, useState } from "react";
import { SimilarItemCard } from "@/components/search/similar-item-card";
import { Button } from "@/components/ui/button";
import { getDictionary } from '@/dictionaries/dictionaries';

interface SimilarObjectsProps {
  similar: any,
}

export function SimilarObjects({ similar }: SimilarObjectsProps) {
  const dict = getDictionary();

  const [visibleSimilar, setVisibleSimilar] = useState(similar?.slice(0, 12));
  const [showAllSimilar, setShowAllSimilar] = useState(false);

  useEffect(() => {
    if (showAllSimilar)
      setVisibleSimilar(similar);
    else
      setVisibleSimilar(similar.slice(0, 12));
  }, [similar, showAllSimilar]);

  useEffect(() => {
    setShowAllSimilar(false);
  }, [similar]);

  if (!similar || similar.length === 0) return null;

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800">
      <section className="container pt-6 pb-8 md:py-8">
        <h2 className="mb-6 text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl">
          {dict['object.similar']}
        </h2>
        <div className="grid grid-cols-2 gap-6 pb-8 md:grid-cols-4 md:pb-10 lg:grid-cols-6">
          {
            visibleSimilar?.length > 0 && visibleSimilar.map(
              (item, i) =>
                item && (
                  <div className="" key={i}>
                    <SimilarItemCard item={item} />
                  </div>
                )
            )
          }
        </div>
        {
          !showAllSimilar && (
            <Button
              onClick={() => setShowAllSimilar(true)}
              variant="default"
              size="sm"
            >
              {dict['object.showMore']}
            </Button>
          )
        }
      </section>
    </div>

  )
}
