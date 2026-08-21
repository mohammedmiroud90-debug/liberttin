'use client';

import { ContentLandingPage } from '@/components/pages/ContentLandingPage';
import { EXTRA_PAGES, HUBS, relatedFromHub } from '@/lib/content-pages';

export default function MentalWellbeingPage() {
  return <ContentLandingPage page={EXTRA_PAGES[0]} related={relatedFromHub(HUBS[0])} />;
}
