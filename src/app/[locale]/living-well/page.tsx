'use client';

import { ContentLandingPage } from '@/components/pages/ContentLandingPage';
import { EXTRA_PAGES, HUBS, relatedFromHub } from '@/lib/content-pages';

export default function LivingWellPage() {
  return <ContentLandingPage page={EXTRA_PAGES[1]} related={relatedFromHub(HUBS[1])} />;
}
