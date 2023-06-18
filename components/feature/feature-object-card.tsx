import Image from 'next/image';
import Link from 'next/link';
import { getObjectUrlWithSlug } from '@/util/various';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function FeatureObjectCard({ tourObject }: { tourObject: any }) {
  if (!tourObject?.id) return null;

  const primaryConstituentName = tourObject.primaryConstituent?.name || 'Maker Unknown';
  const href = getObjectUrlWithSlug(tourObject.id, tourObject.title);

  return (
    <div className={tourObject.positionClassName} style={tourObject.style}>
      <HoverCard>
        <HoverCardTrigger>
          <Link href={href}>
            <Image
              src={tourObject.image?.thumbnailUrl}
              className="object-contain"
              alt=""
              width={400}
              height={400}
            />
          </Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="">
            <h4 className="font-semibold text-neutral-900 dark:text-white">
              {tourObject.title}
            </h4>
            <h5 className="text-sm text-neutral-900 dark:text-white">
              {primaryConstituentName}, {tourObject.date}
            </h5>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
