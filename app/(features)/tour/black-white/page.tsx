import blackWhiteTour from '@/data/BkM/json/tours/blackWhite.json';
import { getTourObjects } from '@/util/feature';

import { BlackWhiteFeature } from '@/components/feature/black-white-feature';

export default async function Page() {
  const tour = await getTourObjects(blackWhiteTour);
  return tour && <BlackWhiteFeature tour={tour} />;
}
