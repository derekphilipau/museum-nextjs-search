import Image from 'next/image';
import Link from 'next/link';
import { getObjectUrlWithSlug } from '@/util/various';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function GiveFlowersCard({
  id,
  title,
  artist,
  date,
  artistDate,
  imgSrc,
  isLight,
  bgColor,
}: {
  id: number;
  title: string;
  artist: string;
  date: string;
  artistDate: string;
  imgSrc: string;
  isLight?: boolean;
  bgColor?: string;
}) {
  const href = getObjectUrlWithSlug(id, title);

  return (
    <Link href={href}>
      <div
        className={`p-4 ${
          bgColor ? 'hover:' + bgColor + '/50 ' + bgColor : 'hover:bg-white/10'
        } `}
      >
        <div className="flex items-center justify-center">
          <Image
            src={imgSrc}
            className="object-contain"
            alt=""
            width={300}
            height={300}
          />
        </div>
        <div
          className={
            isLight
              ? 'text-white dark:text-black'
              : 'text-neutral-900 dark:text-white'
          }
        >
          <h4 className="mt-2 text-sm font-semibold">{title}</h4>
          <h5 className="text-xs">
            {artist}, {artistDate}
          </h5>
        </div>
      </div>
    </Link>
  );
}
