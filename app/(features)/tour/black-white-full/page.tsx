import blackWhiteTour from '@/data/BkM/json/tours/blackWhite.json';
import { getTourObjects } from '@/util/feature';

import { BlackWhiteFeatureFull } from '@/components/feature/black-white-feature-full';

export default async function Page() {
  const tour = await getTourObjects(blackWhiteTour);
  return tour && <BlackWhiteFeatureFull tour={tour} />;
}
