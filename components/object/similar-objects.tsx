"use client"
import { useEffect, useState } from "react";
import { SimilarItemCard } from "@/components/search/similar-item-card";
import { Button } from "@/components/ui/button";

interface SimilarObjectsProps {
  similar: any,
}

export function SimilarObjects({ similar }: SimilarObjectsProps) {

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

  return (
    <>
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
            Show more
          </Button>
        )
      }
    </>
  )
}
